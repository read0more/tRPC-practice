import React, { useState } from "react";
import { trpc } from "./trpc";

export default function ChatForm() {
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
        getMessage.refetch();
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
}
