// const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

import ProductList from "@/components/shared/product/product-list";
import sampleData from "@/db/sample-data";
import { getLatestProduct } from "@/lib/actions/product.action";

// const HomePage = async () => {
//   await delay(2000)
//   return <>ProStore 2</>;
// };

// export default HomePage;


const HomePage = async () => {
  const latestProducts = await getLatestProduct()
  // console.log(latestProducts);


  return <>
    <ProductList data={latestProducts} title="Newest Arrivals" limit={4} />
  </>;
};

export default HomePage;