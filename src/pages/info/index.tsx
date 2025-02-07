import DoubleGlowShadowV2 from '../../components/DoubleGlowShadowV2'
import Container from '../../components/Container'
import MainHeader from '../../features/swap/MainHeader'

const Info = () => {
	return (
    <>
      {/* <MainHeader />      */}
    <DoubleGlowShadowV2 opacity="0.6">
      <Container id="charts-page" maxWidth="7xl" className="grid h-full grid-flow-col grid-cols-5 mx-auto gap-9">
        <div className="col-span-6 space-y-6 bg-dark-900 lg:col-span-6" style={{ zIndex: 1 }}>
            {/* <SwapBanner />      */}
            <iframe 
              frameBorder={"none"}
              title={"INFO"}
              src="https://info.soulswap.finance"
              height={ '720' }
              width={ "100%" }
            />
	        </div>
        </Container>
      </DoubleGlowShadowV2>
    </>

)}

export default Info