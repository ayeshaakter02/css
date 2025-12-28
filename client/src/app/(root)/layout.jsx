import Header from "@/components/common/Header";

export default function MainLayout({ children }) {
  return (
    <div className="h-screen bg-[#fae8eb]">
    <Header/>
    {children}
    </div>
  );
}
