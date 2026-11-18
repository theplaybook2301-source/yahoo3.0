# Messenger 2007 — bản mô phỏng hoài niệm

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
