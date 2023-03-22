import "./App.css";
import { ComponentType, lazy, Suspense } from "react";
import {
  __federation_method_getRemote,
  __mfes_remotesMap
} from  '__federation__'


__mfes_remotesMap['dynamic'] = {
  url: "http://localhost:5000/static/remotes/react-example/latest/remoteEntry.js",
  format: 'esm',
  from: 'vite'
}

console.log("map is", __mfes_remotesMap)



function App() {
  const RemoteButton = lazy(async () => {
  // __federation_method_setRemote('myRemote', {
  //   url: 'http://localhost:5000/static/remotes/react-example/latest/remoteEntry.js',
  //   format: 'esm'
  // })
  console.log("Trying to load remote")
  try {
    const module = await __federation_method_getRemote('dynamic', '.') as Promise<{ default: ComponentType<any>; }>;
    return module;
  } catch {
    console.log("ERROR!!!!!")
  }
});


  return (
    
    <>
      <div className="App">Let me update this and see if it did it change?! there!</div>
      <Suspense fallback={"Could not load dynamic remote"}>
        <RemoteButton />
      </Suspense>
    </>
  );
}

export default App;
