import React, { useState } from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { trpc } from "../trpc";

import "./index.scss";

const client = new QueryClient();

const AppContent = () => {
  const hello = trpc.useQuery(["hello"]);
  const getMessage = trpc.useQuery(["getMessages", 5]);
  const addMessage = trpc.useMutation("addMessage");
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");

  const onAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addMessage.mutate({
      user,
      message,
    }, {
      onSuccess: () => {
        // 이거 두 개 뭔차이인지
        // getMessage.refetch();
        setMessage("");
        client.invalidateQueries(["getMessages"]);
      }
    });
  };

  return (
    <div className='mt-10 text-3xl mx-auto max-w-6xl'>
      {JSON.stringify(getMessage.data)}
      <form onSubmit={onAdd}>
        <input
          type='text'
          value={user}
          onChange={(e) => setUser(e.target.value)}
          style={{ border: '1px solid black' }}
        />
        <input
          type='text'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ border: '1px solid black' }}
        />
          <button type="submit">Add</button>
        </form>
    </div>
  );
};

const App = () => {
  const [trpcClient] = useState(() =>
    trpc.createClient({
      url: "http://localhost:8080/trpc",
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={client}>
      <QueryClientProvider client={client}>
        <AppContent />
      </QueryClientProvider>
    </trpc.Provider>
  );
};
ReactDOM.render(<App />, document.getElementById("app"));
