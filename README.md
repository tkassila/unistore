# unistore
A modified version of tiny centralized state container with component bindings for Preact &amp; React. This version is makes possible change store state under listener function by registering only specific named state change. That way is combines automatic code change and user ui controls changes together. 

By example, a first class a is listening only data change named 'a', then second class b is listening 'step' change named 'b' etc. In first class a store listener function will somehow change data 'a' and then will call store.setState({b: moda}); At last class b has listener which are listen only 'b' named data attribute change. 
