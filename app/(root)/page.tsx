// const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

import DealCountdown from "@/components/deal-countdown";
import IconBoxes from "@/components/icon-boxes";
import ProductCarousel from "@/components/shared/product/product-carousel";
import ProductList from "@/components/shared/product/product-list";;
import { getLatestProduct, getFeaturedProducts } from "@/lib/actions/product.action";

// const HomePage = async () => {
//   await delay(2000)
//   return <>ProStore 2</>;
// };

// export default HomePage;


const HomePage = async () => {
  const latestProducts = await getLatestProduct()
  const featuredProducts = await getFeaturedProducts()
  // console.log(latestProducts);


  return <>
    {featuredProducts.length > 0 && <ProductCarousel data={featuredProducts} />}
    <ProductList data={latestProducts} title="Newest Arrivals" limit={4} />
    <DealCountdown />
    <IconBoxes />
  </>;
};

export default HomePage;