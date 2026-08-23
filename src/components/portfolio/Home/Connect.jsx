import video_3 from '../../../assets/videos/portfolio/main/czz_1.mp4'
import TitleWithLine from '../../common/TitleWithLine'
import ActionButton from '../../common/ActionButton'
import { useNavigate } from 'react-router-dom';


export default function Connect() {
      const navigate = useNavigate();
      const handleActionClick = () => {
        navigate('/login');
      };
    return (
        <>
            <div
                id="s-8"
                className="px-[5vw] py-[60px] bg-white flex flex-col gap-10"
            >
              
                {/* Large Card at Bottom */}
                <div className="flex-1 text-center md:mx-[20vw]">
                    <div className="flex items-center justify-between mb-[5vh]">
                        <ActionButton label="Schedule A Call" onClick={handleActionClick}/>
                        <div className="my-auto">
                            <TitleWithLine text="Brand" />
                        </div>
                    </div>
                    <video
                        src={video_3}
                        className=""
                        loop
                        muted
                        playsInline

                    />
                    <div className="my-[2vh] ">
                        <TitleWithLine text="Results" align="r" />
                    </div>
                    <div className="flex gap-10 md:gap-30">
                        <div className="text-center">
                            <div className="text-lg font-semibold text-[#111]">
                                +88.9m
                            </div>
                            <span className="block text-xs text-[#555]">Views</span>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-semibold text-[#111]">
                                +77%
                            </div>
                            <span className="block text-xs text-[#555]">Engagement rate</span>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-semibold text-[#111]">
                                +683k
                            </div>
                            <span className="block text-xs text-[#555]">Likes</span>
                        </div>
                    </div>
                </div>


            </div>
        </>
    )
}
