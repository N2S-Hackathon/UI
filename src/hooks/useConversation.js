import { useState, useCallback, useRef, useEffect } from 'react';
import { createConversation, getActiveConversation, addConversationTurn } from '../services/api';

/**
 * Custom hook for managing conversation state and polling
 * Implements the 202 Accepted + Polling pattern from the N2S Backend API
 */
export const useConversation = () => {
  const [conversationId, setConversationId] = useState(null);
  const [turns, setTurns] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [lastRequestTime, setLastRequestTime] = useState(null);
  
  const pollIntervalRef = useRef(null);
  const lastStepIdRef = useRef(null);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  // Start polling for conversation updates
  const startPolling = useCallback((convId) => {
    stopPolling(); // Clear any existing interval
    
    pollIntervalRef.current = setInterval(async () => {
      try {
        const data = await getActiveConversation(lastStepIdRef.current);
        
        if (data && data.turns && data.turns.length > 0) {
          setTurns(data.turns);
          
          const latestTurn = data.turns[data.turns.length - 1];
          
          // Update last step ID for efficient polling
          if (latestTurn.llmSteps && latestTurn.llmSteps.length > 0) {
            const lastStep = latestTurn.llmSteps[latestTurn.llmSteps.length - 1];
            lastStepIdRef.current = lastStep.stepId;
          }
          
          // Check if turn is completed
          if (latestTurn.status === 'completed') {
            setIsProcessing(false);
            stopPolling();
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
        setError(err.message);
        // Don't stop polling on error - might be transient
      }
    }, 2000); // Poll every 2 seconds
  }, [stopPolling]);

  // Start a new conversation
  const startConversation = useCallback(async (contextPath, prompt) => {
    setError(null);
    
    // Check time-based concurrency
    const now = Date.now();
    if (lastRequestTime) {
      const timeSinceLastRequest = (now - lastRequestTime) / 1000; // seconds
      
      if (timeSinceLastRequest < 60) {
        const waitTime = Math.ceil(60 - timeSinceLastRequest);
        setError(`Please wait ${waitTime} seconds before starting a new conversation.`);
        return false;
      }
    }
    
    try {
      setIsProcessing(true);
      setLastRequestTime(now);
      
      const result = await createConversation(contextPath, prompt);
      
      if (result) {
        setConversationId(result.conversationId);
        lastStepIdRef.current = null; // Reset for new conversation
        
        // Start polling for updates
        startPolling(result.conversationId);
        
        return true;
      }
    } catch (err) {
      console.error('Failed to start conversation:', err);
      setError(err.message || 'Failed to start conversation');
      setIsProcessing(false);
      return false;
    }
  }, [lastRequestTime, startPolling]);

  // Add a turn to existing conversation
  const addTurn = useCallback(async (prompt, force = false) => {
    if (!conversationId) {
      setError('No active conversation. Start a new one first.');
      return false;
    }
    
    setError(null);
    
    // Check if we can add a turn
    if (turns.length > 0) {
      const latestTurn = turns[turns.length - 1];
      if (latestTurn.status !== 'completed') {
        setError('Previous turn is still processing. Please wait.');
        return false;
      }
    }
    
    // Check time-based concurrency
    const now = Date.now();
    if (lastRequestTime) {
      const timeSinceLastRequest = (now - lastRequestTime) / 1000; // seconds
      
      if (timeSinceLastRequest < 60 && !force) {
        const waitTime = Math.ceil(60 - timeSinceLastRequest);
        setError(`Please wait ${waitTime} seconds before adding a new turn.`);
        return false;
      }
    }
    
    try {
      setIsProcessing(true);
      setLastRequestTime(now);
      
      const result = await addConversationTurn(conversationId, prompt, force);
      
      if (result) {
        // Start polling for the new turn
        startPolling(conversationId);
        return true;
      }
    } catch (err) {
      console.error('Failed to add turn:', err);
      
      // Handle specific error cases
      if (err.message.includes('still processing')) {
        setError('Previous turn is still processing. Please wait.');
      } else if (err.message.includes('force=true')) {
        setError('Previous turn may be stuck. You can force a new turn if needed.');
      } else {
        setError(err.message || 'Failed to add turn');
      }
      
      setIsProcessing(false);
      return false;
    }
  }, [conversationId, turns, lastRequestTime, startPolling]);

  // Reset conversation
  const resetConversation = useCallback(() => {
    stopPolling();
    setConversationId(null);
    setTurns([]);
    setIsProcessing(false);
    setError(null);
    setLastRequestTime(null);
    lastStepIdRef.current = null;
  }, [stopPolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  // Get current status
  const getStatus = useCallback(() => {
    if (!conversationId) return 'idle';
    if (isProcessing) return 'processing';
    if (turns.length > 0 && turns[turns.length - 1].status === 'completed') {
      return 'completed';
    }
    return 'pending';
  }, [conversationId, isProcessing, turns]);

  // Get latest turn
  const getLatestTurn = useCallback(() => {
    return turns.length > 0 ? turns[turns.length - 1] : null;
  }, [turns]);

  // Get time since last request (in seconds)
  const getTimeSinceLastRequest = useCallback(() => {
    if (!lastRequestTime) return null;
    return Math.floor((Date.now() - lastRequestTime) / 1000);
  }, [lastRequestTime]);

  return {
    conversationId,
    turns,
    isProcessing,
    error,
    status: getStatus(),
    latestTurn: getLatestTurn(),
    timeSinceLastRequest: getTimeSinceLastRequest(),
    startConversation,
    addTurn,
    resetConversation,
    canSendMessage: getStatus() === 'idle' || getStatus() === 'completed'
  };
};

export default useConversation;

