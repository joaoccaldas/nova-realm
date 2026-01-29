// Nova's Realm Configuration File
const NovaRealmConfig = {
    game: {
        name: "Nova's Realm: Collaborative Adventure Game",
        version: "1.0.0",
        theme: "CodeQuest Academy",
        maxPlayers: 10, // Support for multiplayer in future versions
        updateRate: 1000, // ms for UI updates
    },
    
    codexia: {
        name: "Codexia",
        role: "AI Guide and Mentor",
        voiceSettings: {
            elevenLabs: {
                apiKey: process.env.ELEVENLABS_API_KEY || "", // Would be set in environment
                voiceId: "codexia_voice_id", // Placeholder ID
                model: "eleven_multilingual_v1",
                settings: {
                    stability: 0.7,
                    similarityBoost: 0.5
                }
            }
        },
        personality: {
            tone: "encouraging",
            expertise: "programming education",
            communicationStyle: "collaborative"
        }
    },
    
    powers: {
        available: [
            {
                id: "loop",
                name: "Loop Mastery",
                description: "Create repeating patterns and structures",
                element: "iteration",
                manaCost: 10,
                effects: ["repetition", "efficiency"]
            },
            {
                id: "function",
                name: "Function Summoning",
                description: "Call forth helpful functions to accomplish tasks",
                element: "modularity",
                manaCost: 15,
                effects: ["abstraction", "reuse"]
            },
            {
                id: "variable",
                name: "Variable Storage",
                description: "Store and manipulate values temporarily",
                element: "storage",
                manaCost: 5,
                effects: ["assignment", "manipulation"]
            },
            {
                id: "conditional",
                name: "Conditional Spell",
                description: "Unlock paths based on logical conditions",
                element: "logic",
                manaCost: 12,
                effects: ["decision", "branching"]
            },
            {
                id: "object",
                name: "Object Creation",
                description: "Summon complex entities with properties",
                element: "structure",
                manaCost: 20,
                effects: ["encapsulation", "complexity"]
            }
        ]
    },
    
    challenges: {
        categories: ["syntax", "logic", "algorithms", "data_structures"],
        difficultyLevels: ["beginner", "intermediate", "advanced"],
        rewardMultiplier: {
            beginner: 1,
            intermediate: 2,
            advanced: 3
        }
    },
    
    collaboration: {
        aiIntegration: true,
        humanAIBalance: 0.5, // 50% human, 50% AI influence
        suggestionFrequency: 30000, // ms between AI suggestions
        conflictResolution: "majority_vote"
    },
    
    apiEndpoints: {
        elevenLabs: "https://api.elevenlabs.io/v1/text-to-speech/",
        knowledgeBase: "/api/knowledge",
        gameState: "/api/gamestate"
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NovaRealmConfig;
}