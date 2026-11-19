# Nhà Mình Messenger — messenger phong cách 2007 cho cả nhà

**Mở app:** https://claude.ai/artifact/SynVFi69xgfTKwbEu7Sj6o

Đây là app nhắn tin thật cho gia đình, giao diện kiểu messenger năm 2007 (cửa sổ tím, mặt cười, BUZZ!). App chạy luôn trên claude.ai nên không cần máy chủ hay cài đặt gì.

## Cách cho cả nhà vào dùng

1. Mở link app ở trên, bấm **Share**.
2. Thêm email từng người thân, chọn quyền **Editor**. Viewer hay Commenter chỉ xem được, không gửi tin được.
3. **Không bật link công khai.** Khi bật, người được mời từ ngoài sẽ mất quyền gửi tin.
4. Mỗi người mở link trong email, đăng nhập claude.ai, bấm *Cho phép* khi được hỏi, chọn nick rồi bấm **Sign In**.

Mỗi người cần có tài khoản claude.ai riêng.

## Tính năng

- **Chat riêng** với từng người và **Phòng chat Cả Nhà** cho mọi người cùng nói chuyện. Tin nhắn được lưu lại, lúc vắng mặt có người nhắn thì lần sau vào sẽ thấy.
- **Biết ai đang online:** mặt cười vàng, biển đỏ (Busy), mặt cười xám (offline, kèm giờ online lần cuối). Có chế độ tàng hình và hiện "đang soạn tin…".
- **BUZZ!** rung màn hình người nhận. **Audibles** là hoạt hình kèm tiếng: gà gáy, vỗ tay, thơm một cái, cười lăn, chúc ngủ ngon, về ăn cơm.
- **Gửi ảnh:** trên điện thoại chụp ảnh trực tiếp từ máy ảnh, ảnh được nén trước khi gửi.
- Chỉnh font, cỡ và màu chữ. Hơn 80 mặt cười vẽ SVG, có thêm **biểu tượng ẩn** như `(pho)`, `(tet)`, `(com)`… IMVironments để đổi nền khung chat.
- Status message sửa trực tiếp, có lưu lịch sử status gần đây.
- **Bạn ảo (AI):** 5 nhân vật teen 9x trả lời bằng Claude. Nếu không dùng được AI thì trả lời theo kịch bản có sẵn.
- **Gõ bằng giọng nói** (nếu trình duyệt hỗ trợ). Âm thanh tạo bằng Web Audio. Dùng tốt trên cả điện thoại lẫn máy tính.

> Tin nhắn riêng chỉ hiện trong khung chat của hai người. Tuy vậy, dữ liệu được lưu chung trong trang, nên ai có quyền Editor về kỹ thuật vẫn đọc được. Đừng gửi mật khẩu hay thông tin nhạy cảm qua app.

## Sửa code và build lại

- Code nằm ở `nha-minh/src/NhaMinhMessenger.jsx` (React + Tailwind + lucide-react).
- Lệnh build:

  ```bash
  cd nha-minh
  npm install
  npm run build   # tạo dist/nha-minh-messenger.html
  ```

- Sau khi build, đăng lại file `dist/nha-minh-messenger.html` lên cùng artifact để giữ nguyên link. App cần các khả năng `db`, `user`, `room`, `sample`, `assets` và `dictation`.

---

# Bản demo một mình: `YahooMessenger2007.jsx`

Ứng dụng web một file (React + Tailwind CSS + lucide-react) mô phỏng trải nghiệm chat kiểu Yahoo! Messenger 8.0/9.0 năm 2007. Chạy tốt trên cả điện thoại lẫn máy tính.

> Đây là bản do fan làm cho vui, **không liên kết với Yahoo**. Ứng dụng không kết nối tới máy chủ nào và không gửi hay lưu mật khẩu. Mọi nick trong danh sách đều là nhân vật ảo, trả lời tự động.

## File

- `YahooMessenger2007.jsx`: component React duy nhất (`export default`), chỉ dùng `react` và `lucide-react@0.263.1`. Code chỉ dùng class Tailwind có sẵn, không có class giá trị tùy ý, nên dán thẳng vào một React Artifact là chạy.

## Tính năng

- **Đăng nhập**: tông tím `#7B0099` và xám bạc, logo mặt cười, có ô Yahoo! ID và Password, các ô *Remember my ID*, *Sign in as invisible*, nút **Sign In** vàng cam. Nhập ID nào cũng vào được.
- **Messenger List**: avatar (bấm để đổi), status message bấm vào sửa trực tiếp, chọn trạng thái (Available / Busy / Be Right Back / Invisible), ô tìm bạn bè, nhóm **Friends** và **Family** thu gọn hoặc mở rộng được. Icon trạng thái: online là mặt cười vàng, busy là biển báo đỏ, offline là mặt cười xám. Có thể thêm bạn mới.
- **Cửa sổ chat** (có tab hội thoại như bản 9.0):
  - Chọn font (Tahoma, Comic Sans MS, Arial…), cỡ chữ, màu chữ, đậm, nghiêng, gạch chân.
  - Hơn 80 emoticon: phần mặt cười vẽ bằng SVG, phần đồ vật dùng emoji. Ký tự gõ như `:D`, `:((`, `;)`, `=))`, `>:)`, `O:-)`, `:-*`, `:-/`, `x(`, `B-)`… tự đổi thành hình khi gửi.
  - Nút **BUZZ!** màu đỏ (hoặc Ctrl+G): rung lắc cửa sổ, phát tiếng rung, hiện chữ **BUZZ!!!** đỏ đậm. Trên điện thoại có rung thật nếu máy hỗ trợ.
  - Webcam, Call, Send File, Games, IMVironments (nền trái tim, bầu trời, vở ô ly). Có hiện “đang soạn tin…” và bật/tắt hiển thị giờ.
- **Âm thanh** tạo bằng Web Audio API: tiếng “ding” khi có tin nhắn, tiếng cửa kẹt khi bạn online (kèm popup ở góc màn hình), tiếng đóng cửa khi bạn offline, tiếng BUZZ.
- **Nhân vật ảo** trả lời theo phong cách teen 9x:
  - `cong_chua_bong_bong`: điệu đà, hay gõ teen code kiểu tÊeN cOdE.
  - `lang_tu_da_tinh`: sến súa, thất tình, đang để trạng thái Busy.
  - `nhoc_quay_pha`: quậy phá, online sau 6 giây và BUZZ lại bạn.
  - `anh_hai_xi_tin`: ông anh khó tính.
  - `me_yeu_cua_con`: mẹ, đang offline, nhắn tin là mẹ sẽ online và gõ toàn chữ in hoa.

  Nhân vật phản ứng với lời chào, câu “asl”, chuyện yêu, buồn, học, ăn, “pp/bye”, BUZZ liên tục, khi bạn đổi status hay đăng nhập ẩn.

## Chạy thử cục bộ

Component cần `react`, `react-dom` và `lucide-react@0.263.1`, kèm Tailwind CSS v3. Bạn có thể dùng bất kỳ bundler nào (Vite, esbuild…) và mount component mặc định vào trang.
