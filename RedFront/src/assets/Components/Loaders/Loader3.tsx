import styled from "styled-components";

const Loader3 = () => {
  return (
    <Container className="dark">
      <StyledWrapper>
        <div className="construction-loader">
          <div className="crane">
            <div className="crane-base"></div>
            <div className="crane-mast"></div>
            <div className="crane-jib"></div>
            <div className="crane-hook"></div>
          </div>
          <div className="buildings">
            <div className="building building-1"></div>
            <div className="building building-2"></div>
            <div className="building building-3"></div>
          </div>
          <div className="tools">
            <div className="hammer"></div>
            <div className="wrench"></div>
            <div className="helmet"></div>
          </div>
        </div>
        <LoadingText>Construyendo el futuro...</LoadingText>
      </StyledWrapper>
    </Container>
  );
};

const Container = styled.div`
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  .construction-loader {
    width: 200px;
    height: 200px;
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }

  /* Grúa */
  .crane {
    position: absolute;
    right: 20px;
    bottom: 0;
    z-index: 3;
  }

  .crane-base {
    width: 8px;
    height: 15px;
    background: #ff7a00;
    margin: 0 auto;
    border-radius: 2px 2px 0 0;
  }

  .crane-mast {
    width: 4px;
    height: 80px;
    background: #ff7a00;
    margin: 0 auto;
    animation: craneRotate 4s ease-in-out infinite;
  }

  .crane-jib {
    width: 60px;
    height: 4px;
    background: #ff7a00;
    position: absolute;
    top: -80px;
    left: 2px;
    border-radius: 2px;
    transform-origin: left center;
    animation: jibMove 3s ease-in-out infinite;
  }

  .crane-hook {
    width: 2px;
    height: 20px;
    background: #666;
    position: absolute;
    top: -76px;
    right: 0;
    animation: hookMove 2s ease-in-out infinite;
  }

  /* Edificios */
  .buildings {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    width: 120px;
    position: absolute;
    bottom: 0;
    left: 20px;
  }

  .building {
    background: linear-gradient(to bottom, #007e4a, #0087c0);
    border-radius: 2px 2px 0 0;
    position: relative;
  }

  .building-1 {
    width: 20px;
    height: 40px;
    animation: buildingGrow1 4s ease-in-out infinite;
  }

  .building-2 {
    width: 25px;
    height: 60px;
    animation: buildingGrow2 4s ease-in-out infinite 0.5s;
  }

  .building-3 {
    width: 22px;
    height: 35px;
    animation: buildingGrow3 4s ease-in-out infinite 1s;
  }

  /* Herramientas */
  .tools {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 15px;
  }

  .hammer,
  .wrench,
  .helmet {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    animation: toolBounce 2s ease-in-out infinite;
  }

  .hammer {
    background: #8b4513;
    animation-delay: 0s;
  }

  .wrench {
    background: #c0c0c0;
    border-radius: 50%;
    animation-delay: 0.3s;
  }

  .helmet {
    background: #ffd700;
    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
    animation-delay: 0.6s;
  }

  /* Animaciones */
  @keyframes craneRotate {
    0%,
    100% {
      transform: rotate(-2deg);
    }
    50% {
      transform: rotate(2deg);
    }
  }

  @keyframes jibMove {
    0%,
    100% {
      transform: rotate(-5deg);
    }
    50% {
      transform: rotate(5deg);
    }
  }

  @keyframes hookMove {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(10px);
    }
  }

  @keyframes buildingGrow1 {
    0% {
      height: 20px;
    }
    50% {
      height: 45px;
    }
    100% {
      height: 40px;
    }
  }

  @keyframes buildingGrow2 {
    0% {
      height: 30px;
    }
    50% {
      height: 65px;
    }
    100% {
      height: 60px;
    }
  }

  @keyframes buildingGrow3 {
    0% {
      height: 15px;
    }
    50% {
      height: 40px;
    }
    100% {
      height: 35px;
    }
  }

  @keyframes toolBounce {
    0%,
    100% {
      transform: translateY(0) rotate(0deg);
    }
    25% {
      transform: translateY(-5px) rotate(5deg);
    }
    50% {
      transform: translateY(-2px) rotate(-3deg);
    }
    75% {
      transform: translateY(-8px) rotate(2deg);
    }
  }
`;

const LoadingText = styled.h2`
  font-family: "Montserrat", sans-serif;
  font-size: 1.2rem;
  color: #ff7a00;
  margin-top: 20px;
  text-align: center;
  font-weight: 600;
  animation: textPulse 2s ease-in-out infinite;

  @keyframes textPulse {
    0%,
    100% {
      opacity: 0.7;
    }
    50% {
      opacity: 1;
    }
  }
`;

export default Loader3;
