import Image from "next/image";
import loader from '@/assets/loader.gif'
import Loader from "@/components/loader";
const LoadingPage = () => {
    return (<div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw'
    }}>
        <Image src={loader} alt="loading.." height={150} width={150} />

    </div>);

    // return <Loader />
}

export default LoadingPage;