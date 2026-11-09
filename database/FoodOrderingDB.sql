USE FoodOrderingDB;
GO

-- 1. BANG LOAI MON AN
CREATE TABLE Loaimonan
(
    Maloai INT IDENTITY(1,1) PRIMARY KEY,
    Tenloai NVARCHAR(100) NOT NULL
);
GO

-- 2. BANG NGUOI DUNG
CREATE TABLE Users
(
    UID INT IDENTITY(1,1) PRIMARY KEY,
    Hoten NVARCHAR(100) NOT NULL,
    Taikhoan VARCHAR(100) NOT NULL,
    Matkhau VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NULL,
    DienthoaiKH VARCHAR(20) NULL,
    DiachiKH NVARCHAR(255) NULL,
    Ngaysinh DATE NULL,
    Role VARCHAR(20) NOT NULL
        CONSTRAINT DF_Users_Role DEFAULT 'khach',

    CONSTRAINT UQ_Users_Taikhoan UNIQUE (Taikhoan),
    CONSTRAINT CK_Users_Role
        CHECK (Role IN ('khach', 'nhanvien', 'admin'))
);
GO

-- Email chi unique khi co gia tri
CREATE UNIQUE INDEX UX_Users_Email
ON Users(Email)
WHERE Email IS NOT NULL;
GO

-- 3. BANG MON AN
CREATE TABLE Monan
(
    Mamon INT IDENTITY(1,1) PRIMARY KEY,
    Tenmon NVARCHAR(150) NOT NULL,
    Giaban DECIMAL(10,2) NOT NULL,
    Giagoc DECIMAL(10,2) NULL,
    Noidung NVARCHAR(500) NULL,
    Anh VARCHAR(255) NULL,
    Maloai INT NOT NULL,

    CONSTRAINT FK_Monan_Loaimonan
        FOREIGN KEY (Maloai)
        REFERENCES Loaimonan(Maloai)
);
GO

-- 4. BANG DON HANG
CREATE TABLE Donhang
(
    MaDH INT IDENTITY(1,1) PRIMARY KEY,
    TinhtrangDH NVARCHAR(50) NOT NULL
        CONSTRAINT DF_Donhang_Tinhtrang
        DEFAULT N'Đang xử lý',

    Ngaydat DATETIME NOT NULL
        CONSTRAINT DF_Donhang_Ngaydat
        DEFAULT GETDATE(),

    Ngaygiao DATETIME NULL,
    UID INT NOT NULL,

    CONSTRAINT FK_Donhang_Users
        FOREIGN KEY (UID)
        REFERENCES Users(UID)
);
GO

-- 5. BANG CHI TIET DON HANG
CREATE TABLE Chitietdonhang
(
    MaCTDH INT IDENTITY(1,1) PRIMARY KEY,
    MaDH INT NOT NULL,
    Mamon INT NOT NULL,
    Soluong INT NOT NULL,
    Dongia DECIMAL(10,2) NOT NULL,

    CONSTRAINT FK_Chitietdonhang_Donhang
        FOREIGN KEY (MaDH)
        REFERENCES Donhang(MaDH),

    CONSTRAINT FK_Chitietdonhang_Monan
        FOREIGN KEY (Mamon)
        REFERENCES Monan(Mamon)
);
GO

-- 6. BANG GIO HANG
CREATE TABLE Giohang
(
    MaGH INT IDENTITY(1,1) PRIMARY KEY,
    UID INT NOT NULL,
    Mamon INT NOT NULL,
    Soluong INT NOT NULL
        CONSTRAINT DF_Giohang_Soluong DEFAULT 1,

    Ngaythem DATETIME NOT NULL
        CONSTRAINT DF_Giohang_Ngaythem
        DEFAULT GETDATE(),

    CONSTRAINT FK_Giohang_Users
        FOREIGN KEY (UID)
        REFERENCES Users(UID)
        ON DELETE CASCADE,

    CONSTRAINT FK_Giohang_Monan
        FOREIGN KEY (Mamon)
        REFERENCES Monan(Mamon)
        ON DELETE CASCADE
);
GO

-- 7. BANG BINH LUAN
CREATE TABLE Binhluan
(
    MaBL INT IDENTITY(1,1) PRIMARY KEY,
    UID INT NOT NULL,
    Mamon INT NOT NULL,
    Noidung NVARCHAR(1000) NOT NULL,
    Ngaytao DATETIME NOT NULL,

    CONSTRAINT FK_Binhluan_Users
        FOREIGN KEY (UID)
        REFERENCES Users(UID),

    CONSTRAINT FK_Binhluan_Monan
        FOREIGN KEY (Mamon)
        REFERENCES Monan(Mamon)
);
GO

/*CHẠY DỮ LIỆU MẪU*/

/* ==========================================
   1. LOAI MON AN
   ========================================== */

INSERT INTO Loaimonan (Tenloai)
VALUES
(N'Cơm'),
(N'Phở'),
(N'Đồ uống'),
(N'Bánh ngọt'),
(N'Mì'),
(N'Gà rán');
GO


/* ==========================================
   2. MON AN
   Giữ nguyên Mamon từ database PHP cũ
   ========================================== */

SET IDENTITY_INSERT Monan ON;

INSERT INTO Monan
    (Mamon, Tenmon, Giaban, Giagoc, Noidung, Anh, Maloai)
VALUES
(1, N'Cơm gà xối mỡ', 40000.00, 45000.00, N'Cơm chiên giòn với gà xối mỡ thơm ngon', 'assets/img/comgaxoimo.jpg', 1),
(2, N'Phở bò tái', 40000.00, 40000.00, N'Phở truyền thống với thịt bò tái mềm', 'assets/img/phobo.jpg', 2),
(3, N'Trà sữa trân châu', 30000.00, 30000.00, N'Trà sữa vị truyền thống, topping trân châu đen', 'assets/img/trasua.webp', 3),
(4, N'Bánh flan caramel', 20000.00, 20000.00, N'Bánh flan mềm mịn, sốt caramel thơm ngon', 'assets/img/banhflan.jpg', 4),
(5, N'Mì xào hải sản', 55000.00, 55000.00, N'Mì xào với tôm, mực, rau củ tươi ngon', 'assets/img/mixaohaisan.jpg', 5),
(6, N'Gà rán giòn', 35000.00, 35000.00, N'Miếng gà chiên giòn rụm đậm vị', 'assets/img/garan.jpg', 6),
(7, N'Nước cam tươi', 25000.00, 25000.00, N'Nước cam ép nguyên chất, không đường', 'assets/img/nuoccam.webp', 3),
(8, N'Matcha đá xay', 35000.00, 35000.00, N'Matcha đá xay', 'assets/img/matchadaxay.webp', 3),
(9, N'Nước ép ổi', 25000.00, 25000.00, N'Nước ổi ép nguyên chất, không đường', 'assets/img/nuocoi.jpg', 3),
(10, N'Cơm chiên dương châu', 50000.00, 50000.00, N'Cơm chiên với xúc xích, trứng và rau củ', 'assets/img/comchien.jpg', 1),
(13, N'Matcha đá xay', 35000.00, 40000.00, N'Thơm, béo', 'assets/img/1764645153_1764642838_matchadaxay.jpg', 3),
(14, N'Phở gà', 45000.00, 50000.00, N'Gà ta, nước ngọt thanh, có thể bạn sẽ thích', 'assets/img/1764645891_phoga.jpg', 2),
(16, N'Nuôi xào ', 45000.00, 50000.00, N'Ngon', 'assets/img/1764646387_nuoixao.jpg', 1),
(17, N'Mì tương đen', 55000.00, 65000.00, N'Mlem', 'assets/img/1764646432_mituongden.jpg', 5),
(18, N'Spagetti', 60000.00, 65000.00, N'Món tui thích nên tui bán ', 'assets/img/1764646497_spagetti.jpg', 5),
(19, N'Gà sốt béo', 75000.00, 85000.00, N'Ngon lắm ăn đi ', 'assets/img/1764646827_gasotbeo.jpg', 6),
(20, N'Chanh dây', 20000.00, 25000.00, N'Chua uống đau bụng ráng chịu ', 'assets/img/1764646882_chanhday.jpg', 3),
(21, N'Gà sốt kem', 85000.00, 95000.00, N'Béo ăn mập ', 'assets/img/1764647062_gasotkem.jpg', 6),
(22, N'Nước ép xoài chanh leo', 25000.00, 30000.00, N'Trending ', 'assets/img/1764647327_xoaichanhleo.jpg', 3),
(23, N'Pizza hải sản', 120000.00, 130000.00, N'No bể bụng', 'assets/img/1764647370_pizza.jpg', 6),
(24, N'Nước chanh', 20000.00, 25000.00, N'Vitamin C', 'assets/img/1764647397_nuocchanh.jpg', 3),
(25, N'Cơm gà ta đùi góc 4', 65000.00, 75000.00, N'Ăn không dai trả tiền lại ', 'assets/img/1764647634_comgata.jpg', 1),
(26, N'Cơm tấm sà bì chưởng', 45000.00, 55000.00, N'Ẩm thực anh em ', 'assets/img/1764647675_comtam.jpg', 1),
(27, N'Sinh tố xoài', 30000.00, 35000.00, N'Healthy', 'assets/img/1764647709_sinhtoxoai.jpg', 3),
(28, N'Mỳ quảng', 35000.00, 45000.00, N'Đặc sản Đà Nẵng', 'assets/img/1764648227_myquang.jpg', 5),
(29, N'Bánh ướt nóng', 25000.00, 30000.00, N'Ngon', 'assets/img/1764648767_banhuotnong.jpg', 2),
(30, N'Bánh xèo', 30000.00, 35000.00, N'6 lá', 'assets/img/1764648824_banhxeo.jpg', 1),
(31, N'Bún bò Huế', 40000.00, 45000.00, N'Ngon', 'assets/img/1764648852_bunbohue.webp', 2),
(32, N'Tiramisu', 45000.00, 50000.00, N'Su béoooo', 'assets/img/1764648931_tiramisu.jpg', 4);

SET IDENTITY_INSERT Monan OFF;
GO

-- Đặt bộ đếm ID món ăn về mã lớn nhất hiện có
DBCC CHECKIDENT ('Monan', RESEED, 32);
GO


/* ==========================================
   3. USERS
   UID tự tăng từ 1 đến 6
   ========================================== */

INSERT INTO Users
    (Hoten, Taikhoan, Matkhau, Email, DienthoaiKH, DiachiKH, Ngaysinh, Role)
VALUES
(N'Nguyễn Văn A', 'nguyenvana', '123456', 'vana@gmail.com', '0901234567', N'123 Lê Lợi, Q1, TP.HCM', '1999-05-15', 'khach'),
(N'Trần Thị B', 'tranthib', 'abcdef', 'thib@gmail.com', '0912345678', N'45 Nguyễn Huệ, TP.HCM', '2000-07-20', 'khach'),
(N'Lê Văn C', 'levanc', '654321', 'levanc@gmail.com', '0934567890', N'22 Hai Bà Trưng, Hà Nội', '1998-12-10', 'khach'),
(N'Phạm Thị D', 'phamthid', 'dpassword', 'thid@gmail.com', '0923456789', N'78 Phan Chu Trinh, Đà Nẵng', '2002-03-05', 'khach'),
(N'Nguyễn Quản Lý', 'admin1', 'admin123', NULL, NULL, NULL, NULL, 'admin'),
(N'Lê Nhân Viên', 'admin2', 'nhanvien01', NULL, NULL, NULL, NULL, 'nhanvien');
GO


/* ==========================================
   4. DON HANG
   ========================================== */

INSERT INTO Donhang
    (TinhtrangDH, Ngaydat, Ngaygiao, UID)
VALUES
(N'Đang xử lý', '2025-11-01T10:30:00', NULL, 1),
(N'Đã giao', '2025-11-02T12:45:00', '2025-11-03T14:00:00', 2),
(N'Đang giao', '2025-11-05T09:15:00', NULL, 3),
(N'Đã hủy', '2025-11-06T18:00:00', NULL, 4);
GO


/* ==========================================
   5. CHI TIET DON HANG
   ========================================== */

INSERT INTO Chitietdonhang
    (MaDH, Mamon, Soluong, Dongia)
VALUES
(1, 1, 2, 45000),
(1, 3, 1, 30000),
(2, 5, 1, 55000),
(2, 7, 2, 25000),
(3, 6, 3, 35000),
(4, 2, 1, 40000);
GO


/* ==========================================
   6. GIO HANG
   ========================================== */

INSERT INTO Giohang (UID, Mamon, Soluong)
VALUES
(1, 1, 2),
(1, 3, 1),
(2, 5, 1),
(2, 7, 2),
(3, 6, 3),
(4, 2, 1),
(4, 4, 2);
GO


/* ==========================================
   7. BINH LUAN
   ========================================== */

INSERT INTO Binhluan (UID, Mamon, Noidung, Ngaytao)
VALUES
(1, 1, N'Món này ăn rất ngon, gà giòn và không bị khô.', '2025-11-02T14:20:00'),
(2, 3, N'Trà sữa ngọt vừa, trân châu dẻo ngon.', '2025-11-03T16:00:00'),
(3, 5, N'Mì xào nhiều hải sản, rất chất lượng!', '2025-11-05T09:30:00'),
(4, 6, N'Gà hơi mặn, nhưng vẫn ngon.', '2025-11-06T19:00:00'),
(2, 4, N'Bánh flan mịn, caramel thơm.', '2025-11-07T10:10:00');
GO

/*KIỂM TRA DỮ LIỆU ĐÃ VÀO CHƯA*/
USE FoodOrderingDB;
GO

SELECT * FROM Loaimonan ORDER BY Maloai;
SELECT * FROM Users ORDER BY UID;
SELECT * FROM Monan ORDER BY Mamon;
SELECT * FROM Donhang ORDER BY MaDH;
SELECT * FROM Chitietdonhang ORDER BY MaCTDH;
SELECT * FROM Giohang ORDER BY MaGH;
SELECT * FROM Binhluan ORDER BY MaBL;