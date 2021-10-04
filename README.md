# unistore - versio of: https://github.com/developit/unistore

A modified version of tiny centralized state container with component bindings for Preact &amp; React. This version makes possible change store state under listener function without any recursion. It is doing that by registering state change listener for only specific attribute state name(s). That way is possible write easy code, that automatic reacts only named data attribute change. On that way, same kind of code that reacts to change from user ui controls changes (react and preact class) or can happen also inside of listening function on same way. That is react event can come from fetch or from ui control! 

By example, a first class A is listening only data change named 'a', then second class B is listening 'step' change named 'b' etc. In first class A store listener function will somehow change data 'a' and then will call store.setState({b: modat}); At last class B has listener which are listen only 'b' named data attribute change. By calling 'subscribeAttributeNameListener', class **B** listener will **not** receive change event calls, when 'c' or 'a' data attribute has been changed! Only when 'b' attribute has been changed. 

Example

By example Parent class is fetching json data, class A is Channeltypes, class B is ProgramTypes etc. Attribute change events are coming from Parent fetching class to ui TV Channeltypes (all, free, pay tv channes) instance, and from the Channeltypes to a TV ProgramTypes (movies, sport, all) instance. Each sub classes are filtering data depending of each selected state ui controls. If a user has select some combo value (=subset/all) to be filtered. All these classes has called function 'subscribeAttributeNameListener' in componentDidMount function, like:

```javascript
let keys = [];
		keys.push('programtypeitems');
        this.unsubscribelistener = 
		    this.store.subscribeAttributeNameListener(keys, state => this.listenerStoreChange2(state) );
```
		    
then function 'listenerStoreChange2' will be called only when 'programtypeitems' has been changed. And this kind of events can changed perhaps under another class store listener event. Those must be called: from a to b, and from b to c etc, not: a -> b -> a !

```javascript
import . . .

export default class A extends Component {

	constructor(props)
	{
		super(props);
		if(Config.bDebug) 
		{
			console.log("A.js");
			console.log("props");
			console.log(props);
		}

  	this.state = {
			errmsg: null,
			 a: null,																					
		}	
	 }

	componentDidMount()
	{
		if(Config.bDebug) 				
			console.log("componentDidMount A");
			
		let keys = [];
		keys.push('a');
        this.unsubscribelistener = 
		   store.subscribeAttributeNameListener(keys, state => this.listenerStoreChange2(state) );                
	}

	componentWillUnmounted()
	{
		if (this.unsubscribelistener != null)
			this.unsubscribelistener();
	}
   listenerStoreChange2 = (storestate) =>
    {
        console.log("A listenerStoreChange2");
        console.log(storestate);
        
        if (storestate === undefined || storestate === null)
        {
            console.log("A listenerStoreChange storestate");
            return;
        }

        const a = storestate.a;	
		if (a == this.state.a)
			return;

		if (Config.bDebug)
		{
			console.log("storestate change");
			console.log("storestate");
			console.log(storestate);
		}

		this.a = a;
		const items = this.filterA(a);
		this.items = items;
    this.setState({ a: a,	});
    store.setState( { b: items });
 }	

	filterA = (channeltype) =>
	{
     ret = ....
     return ret;
	}
  
  uiCtrlChangeEvent = (event) =>
  {
     const change = event.target.text;
     const items = this.filterA(change);
     this.setState({ a: change});
     store.setState({ b: items });
  }
  
//  . . . .
}
```

```javascript
import . . .

export default class B extends Component {

	constructor(props)
	{
		super(props);
		if(Config.bDebug) 
		{
			console.log("B.js");
			console.log("props");
			console.log(props);
		}

  	this.state = {
			errmsg: null,
			 b: null,																					
		}	
	 }

	componentDidMount()
	{
		if(Config.bDebug) 				
			console.log("componentDidMount B");
			
		let keys = [];
		keys.push('b');
		console.log("keys");
		console.log(keys);
        this.unsubscribelistener = store.subscribeAttributeNameListener(keys,
		  state => this.listenerStoreChange2(state) );                
	}

	componentWillUnmounted()
	{
		if (this.unsubscribelistener != null)
			this.unsubscribelistener();
	}

    listenerStoreChange2 = (storestate) =>
    {
        console.log("B listenerStoreChange2");
        console.log(storestate);
        
        if (storestate === undefined || storestate === null)
        {
            console.log("B listenerStoreChange storestate");
            return;
        }

        const b = storestate.b;	
		if (b == this.state.b)
			return;

		if (Config.bDebug)
		{
			console.log("storestate change");
			console.log("storestate");
			console.log(storestate);
		}

		this.b = b;
		const items = this.filterB(b);
		this.items = items;
        this.setState({ b: b,	});
        store.setState( { c: items });
 }	

	filterB = (channeltype) =>
	{
     ret = ....
     return ret;
	}
  
  uiCtrlChangeEvent = (event) =>
  {
     const change = event.target.text;
     const items = this.filterB(change);
     this.setState({ b: change});
     store.setState({ c: items });
  }
 // . . . . .
}
```

Somewhere else:

```javascript
store.setState({a: 'fddsfsdf'});
```

and in an another place:

```javascript
this.unsubscribelistener = store.subscribe( listener );
```

or if you will call store.setState inside of listener, then a must use next kind of subscribe method: 

```javascript
let keys = [];
keys.push('c');
this.unsubscribelistener = 
   store.subscribeAttributeNameListener( keys,
   state => this.listenerStoreChange2(state) ); 
   ```
   
