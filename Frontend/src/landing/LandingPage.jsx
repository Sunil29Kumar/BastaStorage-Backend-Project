import Navbar from "./NavBar";
import Hero from "./Hero";
import Features from "./Features";
import Footer from "./Footer";
import DashboardImage from "./DashboardImage";
import FAQ from "./FAQ.JSX";
import DumiPlans from "./DumiPlans";

const LandingPage = () => {


  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      <Hero  />
      <DashboardImage/>
      <Features />
      <DumiPlans/>
      <FAQ/>
      <Footer />
    </div>
  );
};

export default LandingPage;