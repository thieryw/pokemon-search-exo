import React, { useEffect } from 'react';
import { render } from 'react-dom';
import Hello from './Hello';
import './style.css';
import { useState } from 'react';
import { useEvt, useRerenderOnStateChange } from "evt/hooks";
import { useConst } from "powerhooks/useConst";
import { Deffered } from "evt/tools/Deffered";

function createDebounceTime<Params, R>(
  params: {
    delay: number;
    callback: (params: Params)=> Promise<R>;
  }
){

  const { delay, callback } = params;

  let timer: ReturnType<typeof setTimeout> | undefined = undefined;
  let wrappedParams: [Params] | undefined = undefined;

  function debouncedCallback(params: Params): Promise<R>{

    wrappedParams= [params];

    if( timer !== undefined){
      return
    }

    const dResult= new Deffered<R>();

    timer= setTimeout(
      ()=> callback(wrappedParams[0])
        .then(result => dResult.resolve(result)),delay
    );

    return dResult.pr;

  }

  return debouncedCallback;

}

const App = () => {

  const [results, setResults]= useState<string[]>([]);
  const [ search, setSearch ] = useState("");

  const debouncedPokemonSearch = useConst(()=>
  createDebounceTime({
    "delay": 750,
    "callback": async (search: string) => {
      return search.split("");
    }
  })
  );

  useEffect(
    ()=>{

      if( search.length <= 3) return;

      debouncedPokemonSearch(search).then(
        result=> setResults(result)
      );

    },
    [search]
  );

  return (
    <div>
      <intput
        value={evtSearch.state}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="pokemon"
      />
      <span>{JSON.stringify(results, null, 2)}</span>
    </div>
  );
};

render(<App />, document.getElementById('root'));
