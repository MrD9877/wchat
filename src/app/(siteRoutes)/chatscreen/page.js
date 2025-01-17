import AddNewBtn from "../../components/AddNewBtn";
import ChatBoxTopNav from "../../components/ChatBoxTopNav";
import Chatlog from "../../components/Chatlog";
import NavBarChatBox from "../../components/NavBarChatBox";

export default function ChatscreenPage() {
  return (
    <div>
      <ChatBoxTopNav />
      <Chatlog />
      <AddNewBtn />
      <NavBarChatBox />
    </div>
  );
}
