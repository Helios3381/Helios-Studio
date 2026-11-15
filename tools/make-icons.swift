// Renders the PNG icons for the site from the same sun mark as assets/generated/icons/favicon.svg:
// apple-touch-icon.png (180×180) and og-image.png (1200×630 share image with the studio name).
// Usage: swift tools/make-icons.swift assets/generated/icons
import AppKit
import CoreText

let outDir = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "."
let cs = CGColorSpace(name: CGColorSpace.sRGB)!

func hex(_ s: String, _ a: CGFloat = 1) -> CGColor {
    var v: UInt64 = 0
    Scanner(string: String(s.dropFirst())).scanHexInt64(&v)
    return CGColor(colorSpace: cs, components: [CGFloat((v >> 16) & 255) / 255, CGFloat((v >> 8) & 255) / 255, CGFloat(v & 255) / 255, a])!
}

/// Sun mark centred at c: a disc of radius r and eight rounded rays
func sun(_ ctx: CGContext, _ c: CGPoint, _ r: CGFloat, _ color: CGColor) {
    ctx.setFillColor(color)
    ctx.fillEllipse(in: CGRect(x: c.x - r, y: c.y - r, width: 2 * r, height: 2 * r))
    ctx.setStrokeColor(color)
    ctx.setLineWidth(r * 0.41)
    ctx.setLineCap(.round)
    for i in 0..<8 {
        let a = CGFloat(i) * .pi / 4
        let (r1, r2) = (r * 1.65, r * 2.2)
        ctx.move(to: CGPoint(x: c.x + cos(a) * r1, y: c.y + sin(a) * r1))
        ctx.addLine(to: CGPoint(x: c.x + cos(a) * r2, y: c.y + sin(a) * r2))
    }
    ctx.strokePath()
}

func render(_ w: Int, _ h: Int, _ name: String, _ draw: (CGContext) -> Void) {
    let ctx = CGContext(data: nil, width: w, height: h, bitsPerComponent: 8, bytesPerRow: 0, space: cs, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
    draw(ctx)
    let rep = NSBitmapImageRep(cgImage: ctx.makeImage()!)
    try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: "\(outDir)/\(name)"))
    print("wrote \(outDir)/\(name)")
}

func text(_ ctx: CGContext, _ s: String, _ font: String, _ size: CGFloat, _ color: CGColor, _ at: CGPoint) {
    let f = CTFontCreateWithName(font as CFString, size, nil)
    let attr = NSAttributedString(string: s, attributes: [NSAttributedString.Key(kCTFontAttributeName as String): f, NSAttributedString.Key(kCTForegroundColorAttributeName as String): color])
    let line = CTLineCreateWithAttributedString(attr)
    ctx.textPosition = at
    CTLineDraw(line, ctx)
}

// Home-screen icon: dark navy tile with the gold sun (iOS rounds the corners itself)
render(180, 180, "apple-touch-icon.png") { ctx in
    ctx.setFillColor(hex("#1c2333")); ctx.fill(CGRect(x: 0, y: 0, width: 180, height: 180))
    sun(ctx, CGPoint(x: 90, y: 90), 31, hex("#f59e0b"))
}

// Share image: warm background, glow, sun on the left, studio name and tagline on the right
render(1200, 630, "og-image.png") { ctx in
    ctx.setFillColor(hex("#fbf6ee")); ctx.fill(CGRect(x: 0, y: 0, width: 1200, height: 630))
    let glow = CGGradient(colorsSpace: cs, colors: [hex("#f59e0b", 0.35), hex("#f59e0b", 0)] as CFArray, locations: [0, 1])!
    ctx.drawRadialGradient(glow, startCenter: CGPoint(x: 250, y: 315), startRadius: 0, endCenter: CGPoint(x: 250, y: 315), endRadius: 300, options: [])
    sun(ctx, CGPoint(x: 250, y: 315), 68, hex("#f59e0b"))
    text(ctx, "Helios Studio", "Avenir Next Heavy", 92, hex("#1c2333"), CGPoint(x: 470, y: 330))
    text(ctx, "Games · Apps · Custom commissions", "Avenir Next Demi Bold", 36, hex("#5d6577"), CGPoint(x: 474, y: 264))
    text(ctx, "Nagoya, Japan", "Avenir Next Demi Bold", 30, hex("#ea580c"), CGPoint(x: 474, y: 212))
}
