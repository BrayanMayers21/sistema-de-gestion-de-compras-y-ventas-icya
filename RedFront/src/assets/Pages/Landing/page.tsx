import { About } from "./about";
import { Consultoria } from "./consultoria";
import { Contact } from "./contact";
import { Footer } from "./footer";
import { Header } from "./header";
import { Hero } from "./hero";
import { Obras } from "./obras";
import { Ofertas } from "./ofertas";
import { Services } from "./services";
import { Stats } from "./stats";

export default function Homeiniciodepagina() {
  return (
    <main className="w-full overflow-x-hidden">
      <Header />
      <Hero />
      <About />
      <Obras />
      <Services />
      <Consultoria />
      <Ofertas />
      <Stats />
      <Contact />
      <Footer />
    </main>
  );
}
