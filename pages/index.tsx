import axios from "axios";
import { FormEvent, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

export default function IndexPage({ apiKey }: { apiKey: string }) {
  const [loading, setLoading] = useState<boolean>(false);

  const [conversation, setConversation] = useState<
    {
      request: string;
      response: string;
    }[]
  >([]);
  const [lastMessage, setLastMessage] = useState<string>("");

  const chatListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (chatListRef.current)
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
  }, [loading, conversation]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    const request = (e.target as HTMLFormElement).request.value;
    (e.target as HTMLFormElement).request.value = "";
    
    if (!request) return;

    setLoading(true);
    setLastMessage(request);
    // Set the request parameters
    console.log(request);

    const previousMessages = conversation.map(
      ({ request, response }, index) =>
        `{person: "${request}", chatbot: "${response.replace(/\n/g, " ")}"}`
    );
    const prompt = `Previous conversation: "${previousMessages}" Current message: "${request}" Respond to the current message as the chatbot attempting to simulate a conversation between two secret gay lovers who are runners. Please use innuendos.`;

    console.log(previousMessages);
    console.log(prompt);

    const params = {
      model: (await checkModel(previousMessages, request, apiKey))
        ? "text-davinci-002"
        : "text-davinci-003",
      prompt,
      max_tokens: 2048,
    };

    // Make the request
    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      params,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    console.log(response);

    if (response.status !== 200) {
      setLoading(false);
      return;
    }

    setLoading(false);
    setConversation([
      ...conversation,
      {
        request,
        response: response.data.choices[0].text.replace(/['"]+/g, ""),
      },
    ]);
  };
  return (
    <div className="flex flex-col items-center w-screen h-screen overflow-hidden text-white">
      <div className="flex flex-col items-center w-1/2 h-screen p-8 min-w-min">
        <ul
          ref={chatListRef}
          className="w-full p-4 mx-auto mb-4 overflow-auto text-left bg-gray-700 rounded-lg grow"
        >
          {conversation.map(({ request, response }, index) => (
            <li className="flex flex-col my-4 text-gray-900" key={index}>
              <h2 className="font-medium text-gray-400">You</h2>
              <p className="p-4 bg-gray-200 rounded-lg">{request}</p>
              <h2 className="mt-2 font-medium text-gray-400">Chatbot</h2>
              <p className="p-4 bg-white rounded-lg">{response}</p>
            </li>
          ))}
          {loading && (
            <li className="flex flex-col my-4 text-gray-900">
              <h2 className="font-medium text-gray-400">You</h2>
              <p className="p-4 bg-gray-200 rounded-lg">{lastMessage}</p>
              <h2 className="mt-2 font-medium text-gray-400">Chatbot</h2>
              <p className="p-4 bg-white rounded-lg">Typing...</p>
            </li>
          )}
        </ul>
        <form
          onSubmit={handleSubmit}
          className="flex flex-row items-center w-full gap-4 mb-4"
        >
          <input
            type="text"
            placeholder="Your message..."
            id="request"
            autoComplete="off"
            className="h-full p-2 text-white bg-gray-600 border-2 border-gray-600 rounded outline-none grow w-96 focus:border-blue-500"
          />
          <button
            type="submit"
            className="h-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </form>
      </div>
    </div>
  );
}

export function getStaticProps() {
  return {
    props: {
      apiKey: process.env.OPENAI_API_KEY,
    },
  };
}

async function checkModel(
  previousMessages: string[],
  request: string,
  apiKey: string
) {
  const prompt = `Previous conversation: "${previousMessages}" Current message: "${request}" Please detect if the conversation is inappropriate, is referencing inappropriate material, or is unsafe, return "true" if it is and "false" if it isn't.`;

  const params = {
    model: "text-davinci-003",
    prompt,
    max_tokens: 2048,
  };

  // Make the request
  const response = await axios.post(
    "https://api.openai.com/v1/completions",
    params,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  console.log(response.data.choices[0].text);
  const responseText = response.data.choices[0].text.toLowerCase();

  if (responseText.includes("true")) {
    return true;
  }
  return false;
}
