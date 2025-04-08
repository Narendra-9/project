import Carousel from 'react-bootstrap/Carousel';
import { Link } from 'react-router-dom';


function BannerCarousal(props) {
  const {displayBanners}=props
  return (
    <Carousel interval={2000}>
        {displayBanners?.map(banner=>{
            return (
                    <Carousel.Item key={banner?.bannerId}>
                    <Link to={banner.takeToUrl}>
                        <img src={banner.bannerImgUrl} alt='ffdfd' className="d-block w-100"></img>
                    </Link>
                    </Carousel.Item>
            )
        })}
    </Carousel>
  );
}

export default BannerCarousal;