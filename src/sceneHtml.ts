export const SCENE_HTML = String.raw`

    <div
      id="orientationOverlay"
      style="
        position: fixed;
        inset: 0;
        z-index: 9999;
        background: linear-gradient(135deg, #f472b6 0%, #a855f7 50%, #7c3aed 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 28px;
        padding: 32px;
      "
    >
      <div style="text-align: center; max-width: 360px">
        <div style="margin-bottom: 16px">
          <div
            style="
              width: 110px;
              height: 110px;
              border-radius: 50%;
              background: white;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            "
          >
            <img
              src="https://womensdaypro.onrender.com/assets/images/logo.png"
              alt="Xoay ngang màn hình"
              style="width: 80px; height: 80px; object-fit: contain"
            />
          </div>
        </div>
        <p
          style="
            color: #fff;
            font-size: 1.2rem;
            line-height: 1.7;
            font-family: 'Pacifico', cursive;
            margin: 0 0 8px 0;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          "
        >
          Người đẹp đã sẵn sàng mở quà chưa?
        </p>
      </div>
      <button
        id="btnDaHieu"
        type="button"
        style="
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(8px);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.6);
          border-radius: 50px;
          padding: 14px 40px;
          font-size: 1.05rem;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
          transition: transform 0.15s, box-shadow 0.15s;
        "
        onmouseover="this.style.transform='scale(1.05)'"
        onmouseout="this.style.transform='scale(1)'"
      >
        🎵 Oki, mở quà thôi!
      </button>
    </div>

    <audio id="audio-para-ti" src=""></audio>

    <div id="contenido-principal">
      <div class="night"></div>
      <div class="particles"></div>

      <div class="intro" id="intro">
        <p class="intro__text">Happy Women's Day 8/3</p>
      </div>

      <div class="shooting-stars">
        <div class="shooting-star"></div>
        <div class="shooting-star"></div>
        <div class="shooting-star"></div>
      </div>

      <div class="flowers">
        <div class="flower flower--1">
          <div class="flower__leafs flower__leafs--1">
            <div class="flower__leaf flower__leaf--1"></div>
            <div class="flower__leaf flower__leaf--2"></div>
            <div class="flower__leaf flower__leaf--3"></div>
            <div class="flower__leaf flower__leaf--4"></div>
            <div class="flower__leaf flower__leaf--5"></div>
            <div class="flower__leaf flower__leaf--6"></div>
            <div class="flower__center"></div>

            <div class="flower__light flower__light--1"></div>
            <div class="flower__light flower__light--2"></div>
            <div class="flower__light flower__light--3"></div>
            <div class="flower__light flower__light--4"></div>
            <div class="flower__light flower__light--5"></div>
            <div class="flower__light flower__light--6"></div>
            <div class="flower__light flower__light--7"></div>
            <div class="flower__light flower__light--8"></div>
          </div>
          <div class="flower__line">
            <div class="flower__line__leaf flower__line__leaf--1"></div>
            <div class="flower__line__leaf flower__line__leaf--2"></div>
            <div class="flower__line__leaf flower__line__leaf--3"></div>
            <div class="flower__line__leaf flower__line__leaf--4"></div>
          </div>
        </div>

        <div class="flower flower--2">
          <div class="flower__leafs flower__leafs--2">
            <div class="flower__leaf flower__leaf--1"></div>
            <div class="flower__leaf flower__leaf--2"></div>
            <div class="flower__leaf flower__leaf--3"></div>
            <div class="flower__leaf flower__leaf--4"></div>
            <div class="flower__leaf flower__leaf--5"></div>
            <div class="flower__leaf flower__leaf--6"></div>
            <div class="flower__center"></div>

            <div class="flower__light flower__light--1"></div>
            <div class="flower__light flower__light--2"></div>
            <div class="flower__light flower__light--3"></div>
            <div class="flower__light flower__light--4"></div>
            <div class="flower__light flower__light--5"></div>
            <div class="flower__light flower__light--6"></div>
            <div class="flower__light flower__light--7"></div>
            <div class="flower__light flower__light--8"></div>
          </div>
          <div class="flower__line">
            <div class="flower__line__leaf flower__line__leaf--1"></div>
            <div class="flower__line__leaf flower__line__leaf--2"></div>
            <div class="flower__line__leaf flower__line__leaf--3"></div>
            <div class="flower__line__leaf flower__line__leaf--4"></div>
          </div>
        </div>

        <div class="flower flower--3">
          <div class="flower__leafs flower__leafs--3">
            <div class="flower__leaf flower__leaf--1"></div>
            <div class="flower__leaf flower__leaf--2"></div>
            <div class="flower__leaf flower__leaf--3"></div>
            <div class="flower__leaf flower__leaf--4"></div>
            <div class="flower__leaf flower__leaf--5"></div>
            <div class="flower__leaf flower__leaf--6"></div>
            <div class="flower__center"></div>

            <div class="flower__light flower__light--1"></div>
            <div class="flower__light flower__light--2"></div>
            <div class="flower__light flower__light--3"></div>
            <div class="flower__light flower__light--4"></div>
            <div class="flower__light flower__light--5"></div>
            <div class="flower__light flower__light--6"></div>
            <div class="flower__light flower__light--7"></div>
            <div class="flower__light flower__light--8"></div>
          </div>
          <div class="flower__line">
            <div class="flower__line__leaf flower__line__leaf--1"></div>
            <div class="flower__line__leaf flower__line__leaf--2"></div>
            <div class="flower__line__leaf flower__line__leaf--3"></div>
            <div class="flower__line__leaf flower__line__leaf--4"></div>
          </div>
        </div>

        <div class="flower flower--4">
          <div class="flower__leafs flower__leafs--4">
            <div class="flower__leaf flower__leaf--1"></div>
            <div class="flower__leaf flower__leaf--2"></div>
            <div class="flower__leaf flower__leaf--3"></div>
            <div class="flower__leaf flower__leaf--4"></div>
            <div class="flower__leaf flower__leaf--5"></div>
            <div class="flower__leaf flower__leaf--6"></div>
            <div class="flower__center"></div>

            <div class="flower__light flower__light--1"></div>
            <div class="flower__light flower__light--2"></div>
            <div class="flower__light flower__light--3"></div>
            <div class="flower__light flower__light--4"></div>
            <div class="flower__light flower__light--5"></div>
            <div class="flower__light flower__light--6"></div>
            <div class="flower__light flower__light--7"></div>
            <div class="flower__light flower__light--8"></div>
          </div>
          <div class="flower__line">
            <div class="flower__line__leaf flower__line__leaf--1"></div>
            <div class="flower__line__leaf flower__line__leaf--2"></div>
            <div class="flower__line__leaf flower__line__leaf--3"></div>
            <div class="flower__line__leaf flower__line__leaf--4"></div>
          </div>
        </div>

        <div class="flower flower--5">
          <div class="flower__leafs flower__leafs--5">
            <div class="flower__leaf flower__leaf--1"></div>
            <div class="flower__leaf flower__leaf--2"></div>
            <div class="flower__leaf flower__leaf--3"></div>
            <div class="flower__leaf flower__leaf--4"></div>
            <div class="flower__leaf flower__leaf--5"></div>
            <div class="flower__leaf flower__leaf--6"></div>
            <div class="flower__center"></div>

            <div class="flower__light flower__light--1"></div>
            <div class="flower__light flower__light--2"></div>
            <div class="flower__light flower__light--3"></div>
            <div class="flower__light flower__light--4"></div>
            <div class="flower__light flower__light--5"></div>
            <div class="flower__light flower__light--6"></div>
            <div class="flower__light flower__light--7"></div>
            <div class="flower__light flower__light--8"></div>
          </div>
          <div class="flower__line">
            <div class="flower__line__leaf flower__line__leaf--1"></div>
            <div class="flower__line__leaf flower__line__leaf--2"></div>
            <div class="flower__line__leaf flower__line__leaf--3"></div>
            <div class="flower__line__leaf flower__line__leaf--4"></div>
          </div>
        </div>

        <div class="flower flower--6" style="left: 20%; transform: rotate(-10deg); z-index: 40">
          <div class="flower__leafs flower__leafs--6">
            <div class="flower__leaf flower__leaf--1"></div>
            <div class="flower__leaf flower__leaf--2"></div>
            <div class="flower__leaf flower__leaf--3"></div>
            <div class="flower__leaf flower__leaf--4"></div>
            <div class="flower__leaf flower__leaf--5"></div>
            <div class="flower__leaf flower__leaf--6"></div>
            <div class="flower__center"></div>
          </div>
          <div class="flower__line"></div>
        </div>

        <div class="flower flower--7" style="left: 80%; transform: rotate(15deg); z-index: 40">
          <div class="flower__leafs flower__leafs--7">
            <div class="flower__leaf flower__leaf--1"></div>
            <div class="flower__leaf flower__leaf--2"></div>
            <div class="flower__leaf flower__leaf--3"></div>
            <div class="flower__leaf flower__leaf--4"></div>
            <div class="flower__leaf flower__leaf--5"></div>
            <div class="flower__leaf flower__leaf--6"></div>
            <div class="flower__center"></div>
          </div>
          <div class="flower__line"></div>
        </div>

        <div class="flower flower--8" style="left: 35%; transform: rotate(-25deg); z-index: 30">
          <div class="flower__leafs flower__leafs--8">
            <div class="flower__leaf flower__leaf--1"></div>
            <div class="flower__leaf flower__leaf--2"></div>
            <div class="flower__leaf flower__leaf--3"></div>
            <div class="flower__leaf flower__leaf--4"></div>
            <div class="flower__leaf flower__leaf--5"></div>
            <div class="flower__leaf flower__leaf--6"></div>
            <div class="flower__center"></div>
          </div>
          <div class="flower__line"></div>
        </div>

        <div class="flower flower--9" style="left: 65%; transform: rotate(25deg); z-index: 30">
          <div class="flower__leafs flower__leafs--9">
            <div class="flower__leaf flower__leaf--1"></div>
            <div class="flower__leaf flower__leaf--2"></div>
            <div class="flower__leaf flower__leaf--3"></div>
            <div class="flower__leaf flower__leaf--4"></div>
            <div class="flower__leaf flower__leaf--5"></div>
            <div class="flower__leaf flower__leaf--6"></div>
            <div class="flower__center"></div>
          </div>
          <div class="flower__line"></div>
        </div>
      </div>

      <div class="ramo">
        <img id="bouquetImage" src="https://womensdaypro.onrender.com/assets/images/wrapper_flower.png" alt="Bó hoa" />
        <div class="montes">
          <img
            src="https://womensdaypro.onrender.com/assets/images/grass_left.png"
            alt=""
            class="monte monte-izq"
            style="width: 110px; height: auto; object-fit: contain"
          />
          <img
            src="https://womensdaypro.onrender.com/assets/images/grass_right.png"
            alt=""
            class="monte monte-der"
            style="width: 110px; height: auto; object-fit: contain"
          />
        </div>

        <div class="rabbit rabbit--left">
          <img id="rabbitLeftImage" src="https://womensdaypro.onrender.com/assets/images/mewmew.gif" alt="Con thỏ trái" />
        </div>
        <div class="rabbit rabbit--right">
          <img id="rabbitRightImage" src="https://womensdaypro.onrender.com/assets/images/mewmew.gif" alt="Con thỏ phải" />
        </div>
      </div>

      <div class="letter">
        <div class="letter-envelope">
          <div class="letter-seal"></div>
        </div>
      </div>

      <svg style="position: absolute; width: 0; height: 0; overflow: hidden" aria-hidden="true">
        <defs>
          <filter id="wavyBorder" x="-15%" y="-15%" width="130%" height="130%">
            <feTurbulence type="turbulence" baseFrequency="0.012 0.006" numOctaves="2" seed="5" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="22" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="wavyBorderLight" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="turbulence" baseFrequency="0.015 0.008" numOctaves="2" seed="5" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div class="letter-modal" id="letterModal">
        <div class="letter-modal__backdrop"></div>
        <div class="letter-modal__box-wrap">
          <div class="letter-modal__box">
            <button type="button" class="letter-modal__close" id="letterClose" aria-label="Đóng">&times;</button>
            <h2 class="letter-modal__title" id="letterTitle">Gửi người tôi yêu thương nhất</h2>
            <div class="letter-modal__content" id="letterContent"></div>
            <div class="letter-modal__footer" id="letterModalFooter" style="display: none">
              <button type="button" class="letter-modal__btn-continue" id="letterBtnContinue">Tiếp tục</button>
            </div>
          </div>
        </div>
      </div>

      <div class="photo-float-container" id="photoFloatContainer"></div>
    </div>

    <div class="image-viewer" id="imageViewer" hidden>
      <div class="image-viewer__backdrop"></div>
      <section class="image-book" role="dialog" aria-modal="true" aria-label="Album ảnh và lời khen">
        <button class="image-viewer__close" id="imageViewerClose" type="button" aria-label="Đóng ảnh">×</button>
        <div class="image-book__spread" id="imageBookSpread">
          <article class="image-book__page image-book__page--text">
            <p class="image-book__label">Lời khen</p>
            <p class="image-book__compliment" id="imageViewerCompliment"></p>
          </article>
          <article class="image-book__page image-book__page--photo">
            <img id="imageViewerImage" src="" alt="Ảnh phóng to" />
          </article>
        </div>
        <footer class="image-book__footer">
          <span id="imageViewerCounter"></span>
          <span class="image-book__hint">Chạm nửa trái để lật lùi, chạm nửa phải để lật tới</span>
        </footer>
      </section>
    </div>

    <button class="admin-hotspot" id="adminHotspot" type="button" aria-label="Mở phần sửa ẩn"></button>

    <div class="admin-panel" id="adminPanel" hidden>
      <div class="admin-panel__backdrop" id="adminBackdrop"></div>
      <section class="admin-panel__sheet" role="dialog" aria-modal="true" aria-labelledby="adminTitle">
        <button class="admin-panel__close" id="adminClose" type="button" aria-label="Đóng phần sửa">×</button>
        <h2 id="adminTitle">Phần sửa nội dung</h2>
        <p class="admin-panel__hint">Bảng này ẩn với người dùng. Mở nhanh bằng tổ hợp Ctrl + Shift + E.</p>
        <form class="admin-form" id="adminForm">
          <label>
            <span>Intro text</span>
            <input id="adminIntroText" type="text" required />
          </label>
          <label>
            <span>Tiêu đề thư</span>
            <input id="adminLetterTitle" type="text" required />
          </label>
          <label>
            <span>Nội dung thư</span>
            <textarea id="adminLetterContent" rows="6" required></textarea>
          </label>
          <label>
            <span>Chữ ký</span>
            <input id="adminLetterSignature" type="text" required />
          </label>
          <label>
            <span>Nhạc (URL hoặc data URL)</span>
            <input id="adminMusicUrl" type="text" placeholder="https://...mp3" />
          </label>
          <label>
            <span>Upload nhạc</span>
            <input id="adminMusicFile" type="file" accept="audio/*" />
          </label>
          <label>
            <span>Ảnh bó hoa (URL)</span>
            <input id="adminBouquetImage" type="text" required />
          </label>
          <label>
            <span>Ảnh thỏ trái (URL)</span>
            <input id="adminRabbitLeftImage" type="text" required />
          </label>
          <label>
            <span>Ảnh thỏ phải (URL)</span>
            <input id="adminRabbitRightImage" type="text" required />
          </label>
          <label>
            <span>Ảnh bay (mỗi dòng 1 URL/data URL)</span>
            <textarea id="adminFlyingImages" rows="5"></textarea>
          </label>
          <label>
            <span>Lời khen theo ảnh (mỗi dòng 1 câu)</span>
            <textarea id="adminPhotoCompliments" rows="4"></textarea>
          </label>
          <label>
            <span>Upload nhiều ảnh bay</span>
            <input id="adminFlyingImageFiles" type="file" accept="image/*" multiple />
          </label>
          <div class="admin-form__actions">
            <button class="admin-btn admin-btn--primary" type="submit">Lưu cấu hình</button>
            <button class="admin-btn" id="adminReset" type="button">Reset mặc định</button>
          </div>
          <p class="admin-status" id="adminStatus" aria-live="polite"></p>
        </form>
      </section>
    </div>
`
