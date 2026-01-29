// Nova's Realm Game Script
class NovaRealmGame {
    constructor() {
        // Initialize managers
        this.gameStateManager = new GameStateManager();
        this.browserExtensionIntegration = new BrowserExtensionIntegration();
        this.elevenLabsTTS = new ElevenLabsTTS();
        
        // Initialize player from game state
        this.player = this.gameStateManager.state.players[0];
        
        this.codexia = {
            speaking: false,
            dialogue: document.getElementById('codexia-text'),
            name: NovaRealmConfig.codexia.name
        };
        
        this.challenges = [
            {
                id: "loop_challenge",
                title: "Loop Challenge",
                description: "Create a loop that prints numbers 1 to 10",
                solution: "for(let i=1; i<=10; i++) { console.log(i); }",
                difficulty: "easy",
                category: "syntax"
            },
            {
                id: "function_challenge", 
                title: "Function Challenge", 
                description: "Create a function that adds two numbers",
                solution: "function add(a, b) { return a + b; }",
                difficulty: "easy",
                category: "functions"
            },
            {
                id: "array_challenge",
                title: "Array Challenge",
                description: "Create an array with 5 favorite programming languages",
                solution: "let langs = ['JavaScript', 'Python', 'Java', 'C++', 'Go'];",
                difficulty: "medium",
                category: "data_structures"
            },
            {
                id: "conditional_challenge",
                title: "Conditional Challenge",
                description: "Write an if statement that checks if a number is positive",
                solution: "if(num > 0) { console.log('positive'); }",
                difficulty: "easy",
                category: "logic"
            }
        ];
        
        this.currentChallenge = null;
        this.currentArea = 'academy_commons';
        
        this.initializeGame();
    }
    
    async initializeGame() {
        // Initialize game state manager
        await this.gameStateManager.initialize();
        
        // Connect to external services (will use fallbacks if not available)
        await this.gameStateManager.connectExternalServices();
        
        this.updatePlayerInfo();
        this.setupEventListeners();
        this.generateStartingPowers();
        this.createMapVisualization();
        await this.startCodexiaDialogue();
        
        // Update UI to indicate game is ready
        document.getElementById('ai-status').textContent = 'Codexia is ready to assist';
    }
    
    setupEventListeners() {
        document.getElementById('explore-btn').addEventListener('click', () => this.exploreNewArea());
        document.getElementById('code-challenge-btn').addEventListener('click', () => this.presentCodingChallenge());
        document.getElementById('collaborate-btn').addEventListener('click', () => this.collaborateWithAI());
        document.getElementById('learn-btn').addEventListener('click', () => this.learnNewPower());
        document.getElementById('submit-code-btn').addEventListener('click', () => this.submitCodeSolution());
    }
    
    updatePlayerInfo() {
        // Update player info from game state
        const currentPlayer = this.gameStateManager.state.players[0];
        this.player = currentPlayer;
        
        document.getElementById('player-name').textContent = currentPlayer.name;
        document.getElementById('player-level').textContent = currentPlayer.level;
        document.getElementById('player-mana').textContent = currentPlayer.mana;
        document.getElementById('player-xp').textContent = currentPlayer.xp;
        
        // Update powers display
        const powersContainer = document.getElementById('powers-container');
        powersContainer.innerHTML = '';
        
        // Map power IDs to display names
        const powerDetails = NovaRealmConfig.powers.available.reduce((acc, power) => {
            acc[power.id] = power;
            return acc;
        }, {});
        
        currentPlayer.powers.forEach(powerId => {
            const power = powerDetails[powerId] || { name: powerId, description: 'Unknown power' };
            const powerElement = document.createElement('div');
            powerElement.className = 'power-item';
            powerElement.textContent = power.name;
            powerElement.title = power.description;
            powersContainer.appendChild(powerElement);
        });
    }
    
    generateStartingPowers() {
        // Update player powers through game state manager
        this.gameStateManager.updatePlayer('human-player', {
            powers: ['loop', 'function', 'variable']
        });
        
        this.updatePlayerInfo();
    }
    
    async exploreNewArea() {
        await this.elevenLabsTTS.speakPhrase('exploration_discovery');
        
        // Generate a random new area
        const areas = [
            { id: "forest_of_functions", name: "The Forest of Functions", description: "A lush forest where function trees bear modular code fruit" },
            { id: "mountains_of_memory", name: "The Mountains of Memory", description: "Towering peaks representing the memory hierarchy" },
            { id: "plains_of_programming", name: "The Plains of Programming", description: "Endless plains where algorithms roam freely" },
            { id: "lakes_of_logic", name: "The Lakes of Logic", description: "Crystal clear lakes reflecting boolean truths" },
            { id: "canyons_of_conditionals", name: "The Canyons of Conditionals", description: "Deep canyons with paths that branch based on decisions" },
            { id: "towers_of_types", name: "The Towers of Types", description: "Imposing towers representing different data types" }
        ];
        
        const randomArea = areas[Math.floor(Math.random() * areas.length)];
        this.currentArea = randomArea.id;
        
        // Update game state
        this.gameStateManager.updateWorldState({
            currentArea: randomArea.id,
            currentTime: new Date()
        });
        
        // Update map visualization
        this.createMapVisualization(randomArea.name);
        
        // Record the exploration event
        this.gameStateManager.recordEvent('area_explored', {
            areaId: randomArea.id,
            areaName: randomArea.name,
            timestamp: new Date()
        });
        
        // Update player stats
        const player = this.gameStateManager.state.players[0];
        player.stats.areasExplored += 1;
        this.gameStateManager.updatePlayer('human-player', player);
        
        // Gain some XP
        this.gainXP(10);
        
        // Speak about the new area
        await this.elevenLabsTTS.speakPhrase('area_change', { areaName: randomArea.name });
    }
    
    async presentCodingChallenge() {
        // Select a random challenge
        this.currentChallenge = this.challenges[Math.floor(Math.random() * this.challenges.length)];
        
        const challengeArea = document.getElementById('challenge-area');
        const challengeDescription = document.getElementById('challenge-description');
        
        challengeDescription.innerHTML = `
            <h4>${this.currentChallenge.title} (${this.currentChallenge.difficulty})</h4>
            <p>${this.currentChallenge.description}</p>
        `;
        
        challengeArea.style.display = 'block';
        
        await this.elevenLabsTTS.speakPhrase('challenge_presented', { 
            challengeDescription: this.currentChallenge.description 
        });
    }
    
    async submitCodeSolution() {
        const codeInput = document.getElementById('code-input').value.trim();
        
        if (!this.currentChallenge) {
            await this.elevenLabsTTS.speak("No active challenge to submit. Try selecting a coding challenge first!");
            return;
        }
        
        // Simple validation - in a real game this would be more sophisticated
        if (codeInput.toLowerCase().includes(this.currentChallenge.solution.toLowerCase().split(' ').join('').replace(/[\{\}]/g, ''))) {
            await this.elevenLabsTTS.speakPhrase('challenge_success');
            
            // Award rewards
            this.gainXP(25);
            this.restoreMana(20);
            
            // Update player stats
            const player = this.gameStateManager.state.players[0];
            player.stats.challengesCompleted += 1;
            this.gameStateManager.updatePlayer('human-player', player);
            
            // Record the challenge completion
            this.gameStateManager.recordEvent('challenge_completed', {
                challengeId: this.currentChallenge.id,
                challengeTitle: this.currentChallenge.title,
                timestamp: new Date()
            });
            
            // Hide challenge
            document.getElementById('challenge-area').style.display = 'none';
            document.getElementById('code-input').value = '';
            
            // Reset current challenge
            this.currentChallenge = null;
        } else {
            await this.elevenLabsTTS.speakPhrase('challenge_failure');
        }
    }
    
    async collaborateWithAI() {
        // Simulate collaboration with AI (works independently)
        const aiSuggestions = [
            "Try breaking down the problem into smaller functions",
            "Consider using a loop for repetitive tasks",
            "Remember to declare your variables properly",
            "Check your conditional statements for correct syntax",
            "Make sure your brackets are properly closed",
            "Consider edge cases in your solution"
        ];
        
        const suggestion = aiSuggestions[Math.floor(Math.random() * aiSuggestions.length)];
        
        document.getElementById('ai-suggestions').innerHTML = `
            <strong>Codexia's Suggestion:</strong> ${suggestion}
        `;
        
        document.getElementById('ai-status').textContent = 'Codexia is helping';
        
        await this.elevenLabsTTS.speakPhrase('collaboration_suggestion', { suggestion: suggestion });
        
        // Record the collaboration event
        this.gameStateManager.recordEvent('collaboration_session', {
            type: 'suggestion_given',
            suggestion: suggestion,
            timestamp: new Date()
        });
        
        // Start a collaborative session
        this.gameStateManager.startCollaborativeSession(
            ['human-player', 'codexia'], 
            'General coding assistance'
        );
        
        // Gain some XP for collaboration
        this.gainXP(5);
    }
    
    async learnNewPower() {
        // Define available power IDs that the player can learn
        const allPowerIds = ['conditional', 'object', 'algorithm', 'error', 'recursion'];
        
        // Get powers the player doesn't already have
        const currentPowers = this.gameStateManager.state.players[0].powers;
        const availablePowerIds = allPowerIds.filter(id => !currentPowers.includes(id));
        
        if (availablePowerIds.length > 0) {
            const newPowerId = availablePowerIds[Math.floor(Math.random() * availablePowerIds.length)];
            
            // Find the power details
            const newPower = NovaRealmConfig.powers.available.find(p => p.id === newPowerId);
            
            // Update player's powers
            const player = this.gameStateManager.state.players[0];
            player.powers.push(newPowerId);
            this.gameStateManager.updatePlayer('human-player', player);
            
            // Update UI
            this.updatePlayerInfo();
            
            // Announce the new power
            await this.elevenLabsTTS.speakPhrase('power_learned', { 
                powerName: newPower.name, 
                powerDescription: newPower.description 
            });
            
            // Record the learning event
            this.gameStateManager.recordEvent('power_learned', {
                powerId: newPowerId,
                powerName: newPower.name,
                timestamp: new Date()
            });
        } else {
            await this.elevenLabsTTS.speak("You've already learned all available powers! Continue exploring to discover even more advanced abilities.");
        }
    }
    
    async gainXP(amount) {
        const player = this.gameStateManager.state.players[0];
        const oldLevel = player.level;
        
        player.xp += amount;
        
        // Level up if XP threshold reached
        const xpForNextLevel = player.level * 50;
        if (player.xp >= xpForNextLevel) {
            player.level++;
            player.maxMana += 20;
            player.mana = player.maxMana; // Restore full mana on level up
            
            await this.elevenLabsTTS.speakPhrase('level_up', { level: player.level });
            
            // Record level up event
            this.gameStateManager.recordEvent('level_up', {
                newLevel: player.level,
                timestamp: new Date()
            });
        }
        
        this.gameStateManager.updatePlayer('human-player', player);
        this.updatePlayerInfo();
    }
    
    restoreMana(amount) {
        const player = this.gameStateManager.state.players[0];
        player.mana = Math.min(player.maxMana, player.mana + amount);
        this.gameStateManager.updatePlayer('human-player', player);
        this.updatePlayerInfo();
    }
    
    async codexiaSay(text) {
        this.codexia.dialogue.textContent = text;
        
        // Trigger ElevenLabs TTS
        await this.elevenLabsTTS.speak(text);
    }
    
    createMapVisualization(areaName = "The Academy Commons") {
        const svg = document.getElementById('game-map');
        svg.innerHTML = ''; // Clear previous content
        
        // Create a simple visualization
        const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
        title.setAttribute("x", "50%");
        title.setAttribute("y", "40");
        title.setAttribute("text-anchor", "middle");
        title.setAttribute("fill", "#00eeff");
        title.setAttribute("font-size", "20");
        title.textContent = areaName;
        svg.appendChild(title);
        
        // Add some decorative elements
        for (let i = 0; i < 5; i++) {
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", 100 + i * 100);
            circle.setAttribute("cy", 150 + (i % 2) * 100);
            circle.setAttribute("r", 20);
            circle.setAttribute("fill", "#0077cc");
            circle.setAttribute("stroke", "#00eeff");
            circle.setAttribute("stroke-width", "2");
            svg.appendChild(circle);
        }
        
        // Add some interactive paths
        for (let i = 0; i < 3; i++) {
            const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute("x", 50 + i * 180);
            rect.setAttribute("y", 300);
            rect.setAttribute("width", 120);
            rect.setAttribute("height", 30);
            rect.setAttribute("fill", "#2c5364");
            rect.setAttribute("stroke", "#00aaff");
            rect.setAttribute("stroke-width", "2");
            rect.setAttribute("rx", "5");
            svg.appendChild(rect);
            
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", 110 + i * 180);
            text.setAttribute("y", 320);
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("fill", "white");
            text.setAttribute("font-size", "12");
            text.textContent = ["Forest", "Mountains", "Lakes"][i];
            svg.appendChild(text);
        }
    }
    
    async startCodexiaDialogue() {
        setTimeout(async () => {
            await this.elevenLabsTTS.speakPhrase('welcome');
        }, 1000);
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new NovaRealmGame();
});

// ElevenLabs TTS Integration (placeholder)
function speakWithCodexia(text) {
    // This would integrate with ElevenLabs API in a real implementation
    console.log("TTS would speak:", text);
}