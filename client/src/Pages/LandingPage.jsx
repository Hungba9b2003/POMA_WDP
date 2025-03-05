import React from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 0 15px;
  margin: 0 auto;
  max-width: 1200px;
  text-align: center;
`;

const HeroSection = styled.div`
  text-align: center;
  padding: 100px 0;
  background: #f8f9fa;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: #333;
`;

const Highlight = styled.span`
  color: #007bff;
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: #666;
`;

const Button = styled.a`
  display: inline-block;
  padding: 12px 24px;
  margin-top: 20px;
  background: #007bff;
  color: #fff;
  border-radius: 8px;
  text-decoration: none;
  font-size: 1.2rem;
  transition: 0.3s;
  &:hover {
    background: #0056b3;
  }
`;

const PricingSection = styled.div`
  padding: 80px 0;
  background: #f1f1f1;
`;

const PricingGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
`;

const PricingCard = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;
  transition: 0.3s;
  &:hover {
    transform: translateY(-5px);
  }
`;

const PricingTitle = styled.h3`
  color: #007bff;
  font-size: 1.8rem;
`;

const Price = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 10px 0;
`;

const Features = styled.ul`
  list-style: none;
  padding: 0;
  font-size: 1rem;
  color: #666;
  & li {
    margin: 10px 0;
  }
`;

const PricingButton = styled.a`
  display: inline-block;
  padding: 10px 20px;
  margin-top: 20px;
  background: #007bff;
  color: #fff;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  transition: 0.3s;
  &:hover {
    background: #0056b3;
  }
`;

const Section = styled.div`
  padding: 80px 0;
  background: ${(props) => (props.gray ? "#f8f9fa" : "white")};
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #333;
`;

const FeaturesGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
  margin-top: 30px;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  width: 320px;
  text-align: center;
  transition: 0.3s;
  &:hover {
    transform: translateY(-5px);
  }
`;

function LandingPage() {
  return (
    <>
      <HeroSection>
        <Container>
          <Title>
            Chào mừng đến với <Highlight>POMA</Highlight>
          </Title>
          <Subtitle>
            Giải pháp quản lý dự án hiệu quả cho doanh nghiệp của bạn
          </Subtitle>
          <Button href="#">Bắt đầu ngay</Button>
        </Container>
      </HeroSection>

      <Section>
        <Container>
          <SectionTitle>Tính năng nổi bật</SectionTitle>
          <FeaturesGrid>
            <FeatureCard>
              <h3>Quản lý dự án</h3>
              <p>Theo dõi tiến độ, phân công nhiệm vụ dễ dàng.</p>
            </FeatureCard>
            <FeatureCard>
              <h3>Giao tiếp nhóm</h3>
              <p>Chat nhóm, chia sẻ tài liệu và đồng bộ lịch họp.</p>
            </FeatureCard>
          </FeaturesGrid>
        </Container>
      </Section>

      <PricingSection>
        <Container>
          <h2>Bảng giá</h2>
          <PricingGrid>
            <PricingCard>
              <PricingTitle>Cơ bản</PricingTitle>
              <Price>Miễn phí</Price>
              <Features>
                <li>Tối đa 5 thành viên</li>
                <li>3 dự án cùng lúc</li>
                <li>1GB lưu trữ</li>
              </Features>
              <PricingButton href="#">Đăng ký</PricingButton>
            </PricingCard>

            <PricingCard>
              <PricingTitle>Chuyên nghiệp</PricingTitle>
              <Price>$29/tháng</Price>
              <Features>
                <li>Không giới hạn thành viên</li>
                <li>Không giới hạn dự án</li>
                <li>100GB lưu trữ</li>
              </Features>
              <PricingButton href="#">Mua ngay</PricingButton>
            </PricingCard>

            <PricingCard>
              <PricingTitle>Doanh nghiệp</PricingTitle>
              <Price>Liên hệ</Price>
              <Features>
                <li>Tính năng tùy chỉnh</li>
                <li>API tích hợp</li>
                <li>Không giới hạn lưu trữ</li>
              </Features>
              <PricingButton href="#">Liên hệ</PricingButton>
            </PricingCard>
          </PricingGrid>
        </Container>
      </PricingSection>
    </>
  );
}

export default LandingPage;
