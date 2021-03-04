import { assign } from './util';

/**
 * Creates a new store, which is a tiny evented state container.
 * @name createStore
 * @param {Object} [state={}]		Optional initial state
 * @returns {store}
 * @example
 * let store = createStore();
 * store.subscribe( state => console.log(state) );
 * store.setState({ a: 'b' });   // logs { a: 'b' }
 * store.setState({ c: 'd' });   // logs { a: 'b', c: 'd' }
 */
export default function createStore(state) {
	let listeners = [];
	state = state || {}
	let listenersafterspeckeys = [];

	function unsubscribe(listener) {
		let out = [];
		for (let i=0; i<listeners.length; i++) {
			if (listeners[i]===listener) {
				listener = null;
			}
			else {
				out.push(listeners[i]);
			}
		}
		listeners = out;
	}

	function unsubscribeStateNameListener(listener) {
		let out = [];
		for (let i=0; i<listenersafterspeckeys.length; i++) {
			if (listenersafterspeckeys[i]===listener) {
				listener = null;
			}
			else {
				out.push(listenersafterspeckeys[i]);
			}
		}
		listenersafterspeckeys = out;
	}

	/**
	 * if a listerner function should to be called {@link setState}
	 * @name update updated change object
	 * @name keys defined keys, data attribute names when to receive listener call  
	 */

	function upDateNameIn(update, keys) {
		let ret = false;
		/*
		console.log("upDateNameIn update");
		console.log(update);
		console.log("upDateNameIn keys");
		console.log(keys);
		*/
		for (var key in update) {
			/*
			console.log("upDateNameIn key");
			console.log(key);
			console.log("upDateNameIn value");
			console.log(update[key]);
			*/
			for (let k=0; k<keys.length; k++)
			if (key === keys[k])
			{
				console.log("ret=true");
				ret = true;
				break;
			}
		}
		return ret;
	}

	function setState(update, overwrite, action) {
		state = overwrite ? update : assign(assign({}, state), update);
		let currentListeners = listeners;
		for (let i=0; i<currentListeners.length; i++)
		 {
			currentListeners[i](state, action);
		}

		for (let k=0; k<listenersafterspeckeys.length; k++)
		{   /*
			console.log("setState listenersafterspeckeys");
			console.log(listenersafterspeckeys[k]);
			*/
			if (upDateNameIn(update, listenersafterspeckeys[k].keys))
				listenersafterspeckeys[k].callfunc(state, action);
	    }
	}

	/**
	 * An observable state container, returned from {@link createStore}
	 * @name store
	 */

	return /** @lends store */ {

		/**
		 * Create a bound copy of the given action function.
		 * The bound returned function invokes action() and persists the result back to the store.
		 * If the return value of `action` is a Promise, the resolved value will be used as state.
		 * @param {Function} action	An action of the form `action(state, ...args) -> stateUpdate`
		 * @returns {Function} boundAction()
		 */
		action(action) {
			function apply(result) {
				setState(result, false, action);
			}

			// Note: perf tests verifying this implementation: https://esbench.com/bench/5a295e6299634800a0349500
			return function() {
				let args = [state];
				for (let i=0; i<arguments.length; i++) args.push(arguments[i]);
				let ret = action.apply(this, args);
				if (ret!=null) {
					if (ret.then) return ret.then(apply);
					return apply(ret);
				}
			};
		},

		/**
		 * Apply a partial state object to the current state, invoking registered listeners.
		 * @param {Object} update				An object with properties to be merged into state
		 * @param {Boolean} [overwrite=false]	If `true`, update will replace state instead of being merged into it
		 */
		setState,

		/**
		 * Register a listener function to be called whenever state is changed. Returns an `unsubscribe()` function.
		 * @param {Function} listener	A function to call when state changes. Gets passed the new state.
		 * @returns {Function} unsubscribe()
		 */
		subscribe(listener) {
			listeners.push(listener);
			return () => { unsubscribe(listener); };
		},

		/**
		 * Register a listener object which 'callfunc' attribute function to 
		 * be called whenever object 'keys' array contains same attribute key state 
		 * is changed. Returns an `unsubscribeStateNameListener()` function. A reason for this subribe
		 * function if there is exists recursive listener call exception!
		 * @param {Ojbect} listenerobj A function to call when state changes.
		 * Gets passed the new state.
		 * @returns {Function} unsubscribeStateNameListener()
		 */
		subscribeStateNameListener(listenerobj) {
			listenersafterspeckeys.push(listenerobj);
			return () => { unsubscribeStateNameListener(listenerobj); };
		},

		/**
		 * Remove a previously-registered listener function.
		 * @param {Function} listener	The callback previously passed to `subscribe()` that should be removed.
		 * @function
		 */
		unsubscribe,

		/**
		 * Remove a previously-registered listener function.
		 * @param {Object} listenerobj	The callback previously passed 
		 * to `subscribeStateNameListener()` that should be removed.
		 * @function
		 */
		unsubscribeStateNameListener,

		/**
		 * Retrieve the current state object.
		 * @returns {Object} state
		 */
		getState() {
			return state;
		}
	};
}
