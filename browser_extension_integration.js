// Browser Extension Integration for Nova's Realm
// Handles communication with browser extension for enhanced visualization

class BrowserExtensionIntegration {
    constructor() {
        this.extensionConnected = false;
        this.extensionAPI = null;
        this.visualizationEnabled = true;
        this.eventListeners = new Set();
        
        this.initialize();
    }
    
    initialize() {
        // Check if browser extension is available
        this.checkExtensionAvailability();
        
        // Setup message handling
        this.setupMessageHandling();
        
        // Initialize visualization features
        this.initializeVisualizationFeatures();
    }
    
    // Check if the browser extension is installed and available
    checkExtensionAvailability() {
        // Check for Clawdbot Browser Relay or similar extension
        if (window.clawdbot && window.clawdbot.extension) {
            this.extensionConnected = true;
            this.extensionAPI = window.clawdbot.extension;
            console.log("Browser extension detected and connected");
        } else {
            // Extension not available, fall back to client-side visualization
            this.extensionConnected = false;
            console.log("Browser extension not detected, using fallback visualization");
        }
    }
    
    // Set up message handling between game and extension
    setupMessageHandling() {
        // Listen for messages from the extension
        if (window.addEventListener) {
            window.addEventListener('message', (event) => {
                // Only accept messages from our extension
                if (event.source !== window) return;
                
                if (event.data && event.data.fromExtension) {
                    this.handleExtensionMessage(event.data);
                }
            });
        }
    }
    
    // Handle messages received from the browser extension
    handleExtensionMessage(data) {
        switch (data.type) {
            case 'extension_connected':
                this.onExtensionConnected(data.payload);
                break;
            case 'visualization_request':
                this.handleVisualizationRequest(data.payload);
                break;
            case 'game_action':
                this.handleGameAction(data.payload);
                break;
            case 'collaboration_update':
                this.handleCollaborationUpdate(data.payload);
                break;
            default:
                console.log("Unknown message type from extension:", data.type);
        }
    }
    
    // Called when extension connects
    onExtensionConnected(payload) {
        this.extensionConnected = true;
        console.log("Extension connected with payload:", payload);
        
        // Notify any listeners
        this.notifyEventListeners('extension_connected', payload);
    }
    
    // Handle visualization requests from the extension
    handleVisualizationRequest(payload) {
        const { requestType, params } = payload;
        
        switch (requestType) {
            case 'get_world_state':
                return this.getWorldStateForVisualization();
            case 'update_player_position':
                return this.updatePlayerPosition(params);
            case 'render_area':
                return this.renderArea(params.areaId);
            case 'animate_power_use':
                return this.animatePowerUse(params.powerId, params.target);
            default:
                console.warn("Unknown visualization request:", requestType);
        }
    }
    
    // Handle game actions initiated from the extension
    handleGameAction(payload) {
        const { action, params } = payload;
        
        switch (action) {
            case 'move_player':
                return this.movePlayer(params.direction);
            case 'use_power':
                return this.usePower(params.powerId);
            case 'initiate_collaboration':
                return this.initiateCollaboration(params.participants);
            case 'explore_area':
                return this.exploreArea(params.areaId);
            default:
                console.warn("Unknown game action:", action);
        }
    }
    
    // Handle collaboration updates from the extension
    handleCollaborationUpdate(payload) {
        const { type, data } = payload;
        
        switch (type) {
            case 'code_shared':
                return this.handleSharedCode(data.code, data.author);
            case 'idea_suggested':
                return this.handleIdeaSuggestion(data.idea, data.author);
            case 'problem_identified':
                return this.handleProblemIdentification(data.problem, data.details);
            default:
                console.warn("Unknown collaboration update:", type);
        }
    }
    
    // Get current world state formatted for visualization
    getWorldStateForVisualization() {
        // This would typically pull from the game state manager
        const worldState = {
            timestamp: Date.now(),
            playerPositions: [], // Array of player positions
            areaLayout: {}, // Layout of the current area
            objects: [], // Interactive objects in the scene
            effects: [], // Active visual effects
            uiElements: [] // UI elements to render
        };
        
        // Add player positions
        // In a real implementation, this would come from the actual game state
        worldState.playerPositions = [
            {
                id: 'human-player',
                x: 100,
                y: 150,
                area: 'academy_commons',
                status: 'active'
            }
        ];
        
        // Add area layout
        worldState.areaLayout = {
            id: 'academy_commons',
            name: 'Academy Commons',
            description: 'The central hub of CodeQuest Academy',
            connections: ['forest_of_functions', 'mountains_of_memory'],
            landmarks: [
                { id: 'codexia_statue', x: 300, y: 200, type: 'npc_spawn' },
                { id: 'challenge_board', x: 150, y: 300, type: 'interaction_point' }
            ]
        };
        
        return worldState;
    }
    
    // Update player position in the visualization
    updatePlayerPosition(positionData) {
        console.log("Updating player position:", positionData);
        
        // In a real implementation, this would update the visualization
        // and potentially notify other players
        
        // Notify extension of the change
        this.sendMessageToExtension({
            type: 'player_position_updated',
            payload: positionData
        });
    }
    
    // Render a specific area in the visualization
    renderArea(areaId) {
        console.log("Rendering area:", areaId);
        
        // In a real implementation, this would send detailed rendering instructions
        // to the browser extension
        
        // Return visualization data
        const areaData = {
            areaId: areaId,
            elements: [
                { type: 'terrain', shape: 'rectangle', x: 0, y: 0, width: 800, height: 600, color: '#0a1429' },
                { type: 'path', points: [[100, 100], [200, 200], [300, 100]], color: '#00aaff', width: 5 },
                { type: 'landmark', x: 400, y: 300, name: 'Coding Fountain', icon: ' fountain' }
            ]
        };
        
        return areaData;
    }
    
    // Animate the use of a power in the visualization
    animatePowerUse(powerId, target) {
        console.log("Animating power use:", powerId, "on target:", target);
        
        // Create animation data
        const animation = {
            id: `anim_${Date.now()}`,
            powerId: powerId,
            target: target,
            startTime: Date.now(),
            duration: 2000, // 2 seconds
            effects: [
                { type: 'particles', count: 50, color: '#00eeff' },
                { type: 'beam', source: 'player', target: target, color: '#0077cc' }
            ]
        };
        
        // Send animation to extension
        this.sendMessageToExtension({
            type: 'play_animation',
            payload: animation
        });
        
        return animation;
    }
    
    // Move player in the game world
    movePlayer(direction) {
        console.log("Moving player:", direction);
        
        // In a real implementation, this would update the actual game state
        // For now, we'll simulate the movement
        
        const movement = {
            direction: direction,
            distance: 50, // pixels or units
            completed: true
        };
        
        // Update visualization
        this.sendMessageToExtension({
            type: 'player_moved',
            payload: movement
        });
        
        return movement;
    }
    
    // Use a power in the game
    usePower(powerId) {
        console.log("Using power:", powerId);
        
        // In a real implementation, this would execute the actual power
        // and update game state accordingly
        
        // For demonstration, we'll just animate it
        this.animatePowerUse(powerId, 'self');
        
        return { success: true, powerUsed: powerId };
    }
    
    // Initiate a collaboration session
    initiateCollaboration(participants) {
        console.log("Initiating collaboration with:", participants);
        
        // In a real implementation, this would start a collaboration session
        // and potentially involve the knowledge base and MCP tools
        
        const collaboration = {
            id: `collab_${Date.now()}`,
            participants: participants,
            status: 'active',
            startTime: Date.now()
        };
        
        // Notify extension
        this.sendMessageToExtension({
            type: 'collaboration_started',
            payload: collaboration
        });
        
        return collaboration;
    }
    
    // Explore a new area
    exploreArea(areaId) {
        console.log("Exploring area:", areaId);
        
        // In a real implementation, this would update the game state
        // and load the new area
        
        const area = {
            id: areaId,
            discovered: true,
            challenges: [], // Challenges available in this area
            npcs: [], // NPCs in this area
            resources: [] // Collectible resources
        };
        
        // Update visualization
        this.sendMessageToExtension({
            type: 'area_explored',
            payload: area
        });
        
        return area;
    }
    
    // Handle shared code from collaboration
    handleSharedCode(code, author) {
        console.log(`Received code from ${author}:`, code);
        
        // In a real implementation, this might validate the code
        // and possibly add it to a shared repository
        
        // For now, just acknowledge receipt
        this.sendMessageToExtension({
            type: 'code_received',
            payload: { code, author, acknowledged: true }
        });
    }
    
    // Handle idea suggestion from collaboration
    handleIdeaSuggestion(idea, author) {
        console.log(`Idea suggested by ${author}:`, idea);
        
        // In a real implementation, this might add the idea to a knowledge base
        // or incorporate it into the game world
        
        this.sendMessageToExtension({
            type: 'idea_received',
            payload: { idea, author, acknowledged: true }
        });
    }
    
    // Handle problem identification from collaboration
    handleProblemIdentification(problem, details) {
        console.log("Problem identified:", problem, details);
        
        // In a real implementation, this might create a new challenge
        // or update the game world state
        
        this.sendMessageToExtension({
            type: 'problem_received',
            payload: { problem, details, acknowledged: true }
        });
    }
    
    // Send message to browser extension
    sendMessageToExtension(message) {
        if (this.extensionConnected && this.extensionAPI) {
            // Send through extension API if available
            this.extensionAPI.sendMessage(message);
        } else {
            // Fallback: send via postMessage
            window.postMessage({
                fromGame: true,
                ...message
            }, '*');
        }
    }
    
    // Initialize visualization features
    initializeVisualizationFeatures() {
        if (this.visualizationEnabled) {
            // Set up any necessary visualization initialization
            console.log("Visualization features initialized");
        }
    }
    
    // Add an event listener
    addEventListener(eventType, callback) {
        const listener = { eventType, callback };
        this.eventListeners.add(listener);
        return listener;
    }
    
    // Remove an event listener
    removeEventListener(listener) {
        this.eventListeners.delete(listener);
    }
    
    // Notify event listeners
    notifyEventListeners(eventType, data) {
        for (const listener of this.eventListeners) {
            if (listener.eventType === eventType) {
                listener.callback(data);
            }
        }
    }
    
    // Enable/disable visualization
    setVisualizationEnabled(enabled) {
        this.visualizationEnabled = enabled;
        console.log(`Visualization ${enabled ? 'enabled' : 'disabled'}`);
    }
    
    // Get connection status
    getConnectionStatus() {
        return {
            connected: this.extensionConnected,
            visualizationEnabled: this.visualizationEnabled,
            apiAvailable: !!this.extensionAPI
        };
    }
}

// Initialize the browser extension integration
const browserExtensionIntegration = new BrowserExtensionIntegration();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BrowserExtensionIntegration;
}