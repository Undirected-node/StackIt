import React from "react";
import { useParams } from "react-router-dom";

const ReplyPage = () => {
  const { id } = useParams();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Reply to Question</h1>
      <p>This is a placeholder for replying to question ID: {id}</p>
    </div>
  );
};

export default ReplyPage; 