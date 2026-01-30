// ElevenLabs TTS Integration for Codexia's Voice
// Handles text-to-speech functionality for the AI guide

class ElevenLabsTTS {
    constructor(config) {
        // Wait for NovaRealmConfig to be available
        this.config = config || (typeof NovaRealmConfig !== 'undefined' ? NovaRealmConfig : null);
        if (!this.config) {
            // Create a minimal config if none is available
            this.config = {
                codexia: {
                    voiceSettings: {
                        elevenLabs: {
                            apiKey: null,
                            voiceId: "default",
                            model: "default",
                            settings: { stability: 0.5, similarityBoost: 0.5 }
                        }
                    }
                }
            };
        }
        
        this.apiKey = this.config.codexia?.voiceSettings?.elevenLabs?.apiKey || null;
        this.voiceId = this.config.codexia?.voiceSettings?.elevenLabs?.voiceId || "default";
        this.model = this.config.codexia?.voiceSettings?.elevenLabs?.model || "default";
        this.settings = this.config.codexia?.voiceSettings?.elevenLabs?.settings || { stability: 0.5, similarityBoost: 0.5 };
        
        this.isPlaying = false;
        this.audioQueue = [];
        this.speakingEnabled = true;
        
        // Check if API key is available
        if (!this.apiKey) {
            console.log("ElevenLabs API key not found. TTS will use browser fallback.");
        }
    }
    
    // Speak text using ElevenLabs API
    async speak(text, options = {}) {
        if (!this.speakingEnabled) {
            console.log("TTS disabled, skipping:", text);
            return;
        }
        
        // Add to queue to prevent overlapping speech
        const speechPromise = this.processSpeech(text, options);
        this.audioQueue.push(speechPromise);
        
        // Wait for our turn and play
        await speechPromise;
        
        // Remove from queue once done
        const index = this.audioQueue.indexOf(speechPromise);
        if (index !== -1) {
            this.audioQueue.splice(index, 1);
        }
    }
    
    // Process the speech request
    async processSpeech(text, options) {
        // Wait for any currently playing audio to finish
        while (this.isPlaying) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        this.isPlaying = true;
        
        try {
            if (this.apiKey) {
                // Use ElevenLabs API if key is available
                await this.speakWithElevenLabs(text, options);
            } else {
                // Fallback to browser's built-in speech synthesis
                await this.speakWithBrowser(text, options);
            }
        } catch (error) {
            console.error("Error in speech processing:", error);
            // Fallback to browser if API fails
            await this.speakWithBrowser(text, options);
        } finally {
            this.isPlaying = false;
        }
    }
    
    // Speak using ElevenLabs API
    async speakWithElevenLabs(text, options) {
        // Since we don't have a real API key, always use browser fallback
        await this.speakWithBrowser(text, options);
    }
    
    // Speak using browser's built-in speech synthesis
    async speakWithBrowser(text, options) {
        return new Promise((resolve, reject) => {
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(text);
                
                // Configure voice settings
                utterance.rate = options.rate || 1.0;
                utterance.pitch = options.pitch || 1.0;
                utterance.volume = options.volume || 1.0;
                
                // Find Codexia-like voice if possible
                const voices = speechSynthesis.getVoices();
                const codexiaVoice = voices.find(voice => 
                    voice.name.toLowerCase().includes('female') || 
                    voice.name.toLowerCase().includes('nova') ||
                    voice.lang.startsWith('en')
                ) || voices[0]; // fallback to default
                
                if (codexiaVoice) {
                    utterance.voice = codexiaVoice;
                }
                
                utterance.onend = () => resolve();
                utterance.onerror = (event) => reject(event.error);
                
                speechSynthesis.speak(utterance);
            } else {
                console.warn("Browser speech synthesis not supported");
                // If speech synthesis isn't available, just resolve immediately
                resolve();
            }
        });
    }
    
    // Play audio blob
    async playAudio(audioBlob) {
        return new Promise((resolve, reject) => {
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            
            audio.onended = () => {
                URL.revokeObjectURL(audioUrl);
                resolve();
            };
            
            audio.onerror = (error) => {
                URL.revokeObjectURL(audioUrl);
                reject(error);
            };
            
            audio.play().catch(reject);
        });
    }
    
    // Predefined phrases for common Codexia interactions
    async speakPhrase(phraseType, context = {}) {
        const phrases = {
            welcome: "Welcome to CodeQuest Academy! I'm Codexia, your AI guide. Together we'll explore the magical world of programming concepts and turn code into reality!",
            challenge_presented: `A coding challenge appears! ${context.challengeDescription || 'Can you solve this puzzle using your coding powers?'}`,
            challenge_success: "Excellent! Your solution works perfectly. You've mastered this coding concept!",
            challenge_failure: "Hmm, that doesn't seem quite right. Try reviewing the problem and consider different approaches.",
            level_up: `Level up! You're now level ${context.level || 'unknown'}. Your maximum mana has increased!`,
            power_learned: `Congratulations! You've learned a new power: ${context.powerName || 'unknown'}. ${context.powerDescription || 'A new ability awaits!'}`,
            collaboration_suggestion: `Great idea to collaborate! The AI suggests: ${context.suggestion || 'Try breaking down the problem into smaller parts.'}`,
            exploration_discovery: `You venture into a new area of the CodeQuest Academy. ${context.areaDescription || 'The landscape shifts and changes around you as lines of code materialize into reality!'}`,
            area_change: `You've entered ${context.areaName || 'a mysterious new place'}. What wonders await us here?`
        };
        
        const phrase = phrases[phraseType] || `Codexia says: ${phraseType}`;
        await this.speak(phrase);
    }
    
    // Speak a custom message from Codexia
    async speakAsCodexia(message) {
        await this.speak(message);
    }
    
    // Cancel current speech
    cancelSpeech() {
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
        }
        
        this.isPlaying = false;
        this.audioQueue = [];
    }
    
    // Set speaking enabled/disabled
    setSpeakingEnabled(enabled) {
        this.speakingEnabled = enabled;
    }
    
    // Get current status
    getStatus() {
        return {
            isPlaying: this.isPlaying,
            queueLength: this.audioQueue.length,
            speakingEnabled: this.speakingEnabled,
            apiKeyAvailable: !!this.apiKey
        };
    }
}

// Initialize ElevenLabs TTS
const elevenLabsTTS = new ElevenLabsTTS();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ElevenLabsTTS;
}