/* SUBEDI RABIN M25W0465 */
import Navbar from "../components/Navbar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="">{children}</div>
    </>
  );
};

export default MainLayout;
