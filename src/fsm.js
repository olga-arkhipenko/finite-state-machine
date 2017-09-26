class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config){
        if(!config) throw new Error();
        this.states = config.states;
        this.currentState = config.initial;
        this.initialState = config.initial;
        this.transitionHistory = [config.initial];
        this.deleted = [];
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState(){
        return this.currentState;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state){
        if(!this.states[state]) throw new Error();
        this.currentState = state;
        this.transitionHistory.push(state);
        this.deleted = [];
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event){
        if(this.getStates(event).includes(this.currentState)){
            this.currentState = this.states[this.currentState].transitions[event];
            this.transitionHistory.push(this.currentState);
            this.deleted = [];
        } else throw new Error();
    }

    /**
     * Resets FSM state to initial.
     */
    reset(){
        this.changeState(this.initialState);
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event){
        if(event === undefined) return Object.keys(this.states);
        return Object.keys(this.states).reduce((acc, cur) => {
            if(this.states[cur].transitions[event]){
                acc.push(cur);
                return acc;
            } else return acc;
        }, []);
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo(){
        if(this.transitionHistory.length === 1) return false;
        else {
            this.deleted.push(this.transitionHistory.pop())
            this.currentState = this.transitionHistory[this.transitionHistory.length - 1];
            return true;
        }

    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo(){
        if(this.deleted.length === 0) return false;
        else{
            this.transitionHistory.push(this.deleted.pop());
            this.currentState = this.transitionHistory[this.transitionHistory.length - 1];
            return true;
        }
    }

    /**
     * Clears transition history
     */
    clearHistory(){
        this.transitionHistory = [this.initialState];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
