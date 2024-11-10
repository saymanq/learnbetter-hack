from dotenv import load_dotenv
import os
from langchain_groq import ChatGroq
from typing import Annotated
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages



def llm_output(input):
  load_dotenv()
  groq_api_key = os.getenv("GROQ_API_KEY")
  langsmith = os.getenv("LANGSMITH_API_KEY")

  os.environ["LANGCHAIN_API_KEY"] = langsmith
  os.environ["LANGCHAIN_TRACING_V2"] = "true"
  os.environ['LANGCHAIN_PROJECT'] = 'CourseLanggraph'

  class State(TypedDict):
    messages : Annotated[list, add_messages]

  def chatbot(state: State):
    return {"messages": llm.invoke(state['messages'])}

  llm = ChatGroq(groq_api_key = groq_api_key, model_name = 'Llama-3.2-90b-Text-Preview')


  graph_builder = StateGraph(State)
  graph_builder.add_node("chatbot", chatbot)
  graph_builder.add_edge(START, "chatbot")
  graph_builder.add_edge("chatbot", END)
  graph = graph_builder.compile()

  
  output = []
  for event in graph.stream({'messages': ("user", input)}):
    for value in event.values():
      output.append(value['messages'].content)
      #print("Assistant:" ,value['messages'].content)
  return output