import React from "react";
import { Outlet } from "react-router-dom";
import styles from "../Styles/Landing/Landing.module.css";

function LandingPage() {
  return (
    <>
      <div data-spy="scroll" data-target=".navbar" data-offset="51">
        <div id="nav"></div>

        {/* Hero Section */}
        <div className={`${styles.header}`} id="header">
          <div className={`${styles.container}`}>
            <h1 className={styles.title}>
              Chào mừng đến với <span className={styles.highlight}>POMA</span>
            </h1>
            <p className={styles.subtitle}>Giải pháp quản lý dự án hiệu quả cho doanh nghiệp của bạn</p>
            <a className={`${styles.btn} ${styles.btnPrimary}`} href="">
              <i className="fas fa-rocket"></i> Bắt đầu ngay
            </a>
          </div>
        </div>

        {/* Features Section */}
        <div className={`${styles.features}`} id="features">
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h4 className={styles.sectionTag}>Khám phá</h4>
              <h2 className={styles.sectionTitle}>Tính năng nổi bật</h2>
            </div>
            <div className={`${styles.row} ${styles.alignItemsCenter}`}>
              <div className={styles.colMd6}>
                <div className={styles.featureContent}>
                  <h3>Quản lý dự án toàn diện</h3>
                  <ul className={styles.featureList}>
                    <li>Theo dõi tiến độ dự án theo thời gian thực</li>
                    <li>Phân công và quản lý công việc hiệu quả</li>
                    <li>Báo cáo chi tiết và trực quan</li>
                    <li>Tích hợp với nhiều công cụ phổ biến</li>
                  </ul>
                </div>
                <div className={styles.featureContent}>
                  <h3>Giao tiếp nhóm</h3>
                  <ul className={styles.featureList}>
                    <li>Chat nhóm và trao đổi trực tiếp</li>
                    <li>Chia sẻ tài liệu dễ dàng</li>
                    <li>Thông báo và nhắc nhở tự động</li>
                    <li>Lịch họp và sự kiện được đồng bộ</li>
                  </ul>
                </div>
              </div>
              <div className={styles.colMd6}>
                <div className={styles.featureImage}>
                  <img src="/images/dashboard-preview.png" alt="Dashboard Preview" className={styles.img} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className={styles.projects} id="projects">
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h4 className={styles.sectionTag}>Khám phá</h4>
              <h2 className={styles.sectionTitle}>Dự án mẫu</h2>
            </div>
            <div className={`${styles.row} ${styles.alignItemsCenter}`}>
              <div className={styles.colMd6}>
                <div className={styles.projectImage}>
                  <img src="/images/project-sample-1.jpg" alt="Project Sample" className={styles.img} />
                </div>
              </div>
              <div className={styles.colMd6}>
                <div className={styles.projectDetail}>
                  <h3 className={styles.projectTitle}>
                    <i className="fas fa-project-diagram"></i>
                    Quản lý dự án phần mềm
                  </h3>
                  <ul className={styles.projectFeatures}>
                    <li>Theo dõi sprint và backlog</li>
                    <li>Quản lý bug và issues</li>
                    <li>Code review và CI/CD</li>
                    <li>Báo cáo và metrics</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className={styles.pricing} id="pricing">
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h4 className={styles.sectionTag}>Chi phí</h4>
              <h2 className={styles.sectionTitle}>Bảng giá</h2>
            </div>
            <div className={styles.pricingGrid}>
              <div className={styles.pricingCard}>
                <div className={styles.pricingHeader}>
                  <h3>Cơ bản</h3>
                  <p>Cho nhóm nhỏ</p>
                  <i className="fas fa-user-friends"></i>
                </div>
                <ul className={styles.pricingFeatures}>
                  <li>Tối đa 5 thành viên</li>
                  <li>3 dự án cùng lúc</li>
                  <li>1GB lưu trữ</li>
                  <li>Hỗ trợ email</li>
                </ul>
                <a href="#" className={`${styles.btn} ${styles.btnPricing}`}>
                  Miễn phí
                </a>
              </div>

              <div className={`${styles.pricingCard} ${styles.featured}`}>
                <div className={styles.pricingHeader}>
                  <h3>Chuyên nghiệp</h3>
                  <p>Cho doanh nghiệp vừa</p>
                  <i className="fas fa-building"></i>
                </div>
                <ul className={styles.pricingFeatures}>
                  <li>Không giới hạn thành viên</li>
                  <li>Không giới hạn dự án</li>
                  <li>100GB lưu trữ</li>
                  <li>Hỗ trợ 24/7</li>
                </ul>
                <a href="#" className={`${styles.btn} ${styles.btnPricing}`}>
                  $29/tháng
                </a>
              </div>

              <div className={styles.pricingCard}>
                <div className={styles.pricingHeader}>
                  <h3>Doanh nghiệp</h3>
                  <p>Cho tập đoàn lớn</p>
                  <i className="fas fa-crown"></i>
                </div>
                <ul className={styles.pricingFeatures}>
                  <li>Tính năng tùy chỉnh</li>
                  <li>API tích hợp</li>
                  <li>Không giới hạn lưu trữ</li>
                  <li>Hỗ trợ ưu tiên 24/7</li>
                </ul>
                <a href="#" className={`${styles.btn} ${styles.btnPricing}`}>
                  Liên hệ
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className={styles.contact} id="contact">
          <div className={styles.container}>
            <div className={styles.sectionHeader}>
              <h4 className={styles.sectionTag}>Liên hệ</h4>
              <h2 className={styles.sectionTitle}>Đăng ký tư vấn</h2>
            </div>
            <div className={styles.contactForm}>
              <form>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <input
                      type="text"
                      className={styles.formControl}
                      placeholder="Họ tên"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <input
                      type="email"
                      className={styles.formControl}
                      placeholder="Email"
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <input
                    type="text"
                    className={styles.formControl}
                    placeholder="Công ty"
                  />
                </div>
                <div className={styles.formGroup}>
                  <textarea
                    className={styles.formControl}
                    rows="5"
                    placeholder="Nhu cầu sử dụng"
                  ></textarea>
                </div>
                <button className={`${styles.btn} ${styles.btnSubmit}`} type="submit">
                  Gửi yêu cầu
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <footer className={styles.footer}>
          <div className={styles.container}>
            <div className={styles.footerGrid}>
              <div className={styles.footerColumn}>
                <h2>Thông tin liên hệ</h2>
                <div className={styles.contactInfo}>
                  <h4>Email:</h4>
                  <p>contact@projectmanager.com</p>
                  <h4>Hotline:</h4>
                  <p>1900 1234</p>
                </div>
              </div>
              <div className={styles.footerColumn}>
                <h2>Kết nối</h2>
                <div className={styles.socialLinks}>
                  <a href="#" className={styles.socialLink}>
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className={styles.socialLink}>
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                  <a href="#" className={styles.socialLink}>
                    <i className="fab fa-twitter"></i>
                  </a>
                </div>
              </div>
              <div className={styles.footerColumn}>
                <h2>Nhận thông tin</h2>
                <div className={styles.subscribe}>
                  <form>
                    <input
                      type="email"
                      className={styles.formControl}
                      placeholder="Email của bạn"
                    />
                    <button className={`${styles.btn} ${styles.btnSubscribe}`} type="submit">
                      Đăng ký
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </footer>

        <a href="#" className={styles.backToTop}>
          <i className="fas fa-angle-up"></i>
        </a>
      </div>
    </>
  );
}

export default LandingPage;
