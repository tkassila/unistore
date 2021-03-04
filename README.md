# unistore
A modified version of tiny centralized state container with component bindings for Preact &amp; React. This version is makes possible change store state under listener function by registering only specific named state change. That way is combines automatic code change and user ui controls changes together. 

By example, a first class a is listening only data change named 'a', then second class b is listening 'step' change named 'b' etc. In first class a store listener function will somehow change data 'a' and then will call store.setState({b: moda}); At last class b has listener which are listen only 'b' named data attribute change. 

import ...

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
			
		let listenerobj = {}
		listenerobj.keys = [];
		listenerobj.keys.push('a');
		listenerobj.callfunc = state => this.listenerStoreChange2(state);
		console.log("listenerobj");
		console.log(listenerobj);
        this.unsubscribelistener = store.subscribeStateNameListener( listenerobj );                
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
}

import ...

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
			
		let listenerobj = {}
		listenerobj.keys = [];
		listenerobj.keys.push('b');
		listenerobj.callfunc = state => this.listenerStoreChange2(state);
		console.log("listenerobj");
		console.log(listenerobj);
        this.unsubscribelistener = store.subscribeStateNameListener( listenerobj );                
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

	filterA = (channeltype) =>
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
}

Somewhere else:

store.setState({a: 'fddsfsdf'});

and in an another place:

this.unsubscribelistener = store.subscribe( listener );

or if you will call store.setState inside of listener: 

let listenerobj = {}
listenerobj.keys = [];
listenerobj.keys.push('c');
listenerobj.callfunc = state => this.listenerStoreChange2(state);
this.unsubscribelistener = store.subscribeStateNameListener( listenerobj ); 
