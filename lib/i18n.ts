import { VENUE_ADDRESS, VENUE_COORDINATES } from "@/lib/config";

export const languages = ["en", "jp"] as const;

export type Language = (typeof languages)[number];

export const defaultLanguage: Language = "en";

export const i18n = {
  en: {
    nav: {
      home: "Home",
      gallery: "Gallery",
      about: "About",
      map: "Map",
      menu: "Menu",
      menuClose: "Close",
      mainLabel: "Main",
      mobileMainLabel: "Mobile main",
      next: "Next",
      nextShow: "Next show",
      toggleLabel: "Switch language",
      languageNames: {
        en: "English",
        jp: "Japanese",
      },
      jptClock: "JPT",
      showLive: "Live",
      showOffline: "Offline",
    },
    home: {
      mapLabel: "Open venue location in Google Maps",
      titleLine1: "LIVE STAND-UP.",
      titleLine2: "SERIOUS FUN.",
      subtitle:
        "Photos, clips, and a room that doesn’t take itself too seriously—except when the mic is on.",
      seeRoom: "See the room",
      getTickets: "Get tickets",
      venueAddress: VENUE_ADDRESS,
      venueCoordinates: VENUE_COORDINATES,
    },
    about: {
      eyebrow: "About",
      title: "The people behind the room",
      founderImageLabel: "Founder profile image",
      founderImageAlt: "Founder profile",
      founderRole: "Founder",
      founderName: "Tsukasa Kakiudo",
      founderIntro:
        "After walking for Rick Owens and Gucci, the founder found stand-up comedy during a difficult chapter in Europe. That discovery became the start of a new mission: to grow English comedy in Tokyo and build a room for people who need one.",
      founderStory: [
        "Five years ago, I went to Europe to pursue my dream of becoming a runway model, walking in Paris and Milan. I achieved that dream when I walked for Rick Owens, and soon after for Gucci in Rome. My first year went well, but in my second year, I began to struggle with depression. The modeling industry is unpredictable and often superficial, and I found it difficult to know who to trust. Relationships felt temporary, and the environment became mentally exhausting.",
        "While staying in a model apartment in Milan, I randomly came across a YouTube video by a stand-up comedian from Hong Kong. That moment changed my life. I started watching more of his content and began attending local comedy shows-something quite unusual for a fashion model.",
        "After two years of learning at comedy clubs in Milan and Paris, I performed at my first open mic in Paris in 2024. Since then, I’ve performed in Tokyo, Melbourne, Milan, Amsterdam, Berlin, and Hong Kong. In May, I launched my own English stand-up comedy show at Moxy Tokyo Kinshicho, thanks to their support.",
        "Now, my goal is to grow the English stand-up comedy scene in Tokyo, where there are still fewer opportunities compared to Europe and the U.S. I want to create more spaces for people who are struggling, just as I once did. As a fashion model, I also aim to combine comedy with fashion and photography to create a new style and value in the comedy world.",
      ],
      hideStory: "Hide full story",
      readStory: "Read full story",
      creativeDirectorImageLabel: "Creative director profile image",
      creativeDirectorImageAlt: "Creative director profile",
      creativeDirectorRole: "Creative Director",
      creativeDirectorName: "SKMNG",
      creativeDirectorIntro:
        "SKMNG, born in Hong Kong and currently based in Tokyo. centres on composition, silhouette, and above all, emotional resonance.",
      creativeDirectorStory: [
        "It began with his mother's camera at the age of 14. Since then, photography has become a lifelong devotion, a way of suspending time, of finding meaning in the fleeting.",
        "working exclusively with prime lenses: 28mm and 43mm, their demands sharpen awareness, compel movement rather than zoom, and uncover new perspectives with each step.",
        "Now working as a web and graphic designer, while exploring a range of creative disciplines and continuing to nurture a deep passion for photography.",
      ],
    },
    schedule: {
      eyebrow: "Schedule",
      title: "Upcoming shows",
      introPrefix:
        "Four shows a month, at most one per Monday–Sunday week. Calendar rows are Wed / Fri / Wed / Fri unless the first row has no Wednesday: then the first Wednesday is the Wednesday of the week after the week with the second row's Friday, Week 2 Friday stays that Friday, and if row 2 Wednesday would repeat that date we use the next row's Wednesday instead. Shows start at",
      upcomingDates: "Upcoming dates",
      ticketOptions: "Ticket options",
      weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      showLabels: {
        week1Wed: "Week 1 Wed",
        week2Fri: "Week 2 Fri",
        week3Wed: "Week 3 Wed",
        week4Fri: "Week 4 Fri",
      },
    },
    footer: {
      label: "Social and location",
      next: "Next",
      instagram: "Instagram",
      googleMaps: "Google Maps",
      comedianSignup: "Comedian signup",
    },
    tickets: {
      defaultLabel: "Tickets",
      openBoxOffice: "Open box office",
      bookHere: "Book on WSSC",
      meetup: "Meetup",
      eventbrite: "Eventbrite",
    },
    gallery: {
      emptyPrefix: "No images found. Expected public images under",
    },
    map: {
      eyebrow: "Location",
      title: "Find the room in Kinshicho",
      subtitle:
        "English stand-up at Moxy Tokyo Kinshicho — Kotobashi, Kinshicho, Sumida-ku, Tokyo.",
      venueMarker: "Moxy Kinshicho",
      metroStation: "Kinshicho Station",
      walkToMetro: (minutes: number) => `${minutes} min walk`,
      unavailableTitle: "Map requires a Mapbox token",
      unavailableHint:
        "Add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your environment to enable the interactive map.",
    },
    ticketsPage: {
      title: "Tickets",
      description:
        "Book upcoming shows and special nights directly here. Every order gets a unique door code by email after checkout.",
      regularShow: "Regular show",
      specialEvent: "Special event",
      remaining: (count: number) =>
        count === 1 ? "1 seat left" : `${count} seats left`,
      soldOut: "Sold out",
      priceLabel: (amount: number) => `¥${amount.toLocaleString("en-US")}`,
      emailLabel: "Email",
      nameLabel: "Name (optional)",
      quantityLabel: "Tickets",
      dateLabel: "Show date",
      timeLabel: "Time",
      availabilityLabel: "Availability",
      bookButton: "Book with Stripe",
      booking: "Redirecting to checkout…",
      checkoutUnavailable:
        "Online checkout is being wired up. Add your Stripe keys to enable booking.",
      cancelled: "Checkout was cancelled. Your card was not charged.",
      thirdPartyTitle: "Prefer a partner box office?",
      thirdPartyDescription: "Meetup and Eventbrite are still available if that’s easier.",
      backHome: "Back home",
      successTitle: "You’re booked",
      successDescription:
        "Save this code for the door. We also emailed it to you when checkout completed.",
      successEmailNote: "Check your inbox for the same code.",
      successPending:
        "Payment received — your ticket code is being generated. Refresh in a moment.",
      successMissing: "We couldn’t find that booking. If you were charged, contact us with your receipt.",
      codeLabel: "Your door code",
      quantityNote: (count: number) =>
        count === 1 ? "1 ticket" : `${count} tickets`,
    },
  },
  jp: {
    nav: {
      home: "ホーム",
      gallery: "ギャラリー",
      map: "マップ",
      about: "アバウト",
      menu: "Menu",
      menuClose: "Close",
      mainLabel: "メインナビゲーション",
      mobileMainLabel: "モバイルメインナビゲーション",
      next: "次回",
      nextShow: "次回公演",
      toggleLabel: "言語を切り替える",
      languageNames: {
        en: "英語",
        jp: "日本語",
      },
      jptClock: "JPT",
      showLive: "ライブ",
      showOffline: "オフライン",
    },
    home: {
      mapLabel: "Google Mapsで会場を見る",
      titleLine1: "ライブ・スタンドアップ。",
      titleLine2: "本気で笑え。",
      subtitle:
        "写真、映像、そして肩の力を抜いて笑える空間。マイクが入った瞬間だけは、もちろん本気です。",
      seeRoom: "会場を見る",
      getTickets: "チケットを取る",
      venueAddress: "モクシー東京錦糸町、東京都墨田区江東橋3-4-2",
      venueCoordinates: "北緯35.696°、東経139.814°",
    },
    about: {
      eyebrow: "アバウト",
      title: "この空間をつくる人たち",
      founderImageLabel: "創設者プロフィール画像",
      founderImageAlt: "創設者プロフィール",
      founderRole: "創設者",
      founderName: "柿宇土　僚",
      founderIntro:
        "Rick OwensやGucciのランウェイを歩いた後、創設者はヨーロッパで苦しい時期にスタンドアップコメディと出会いました。その体験が、東京で英語コメディを育て、必要としている人のための居場所をつくるという新しい使命の始まりになりました。",
      founderStory: [
        "5年前、ランウェイモデルになる夢を追ってヨーロッパへ渡り、パリとミラノで活動しました。Rick Owensのショーを歩き、その後ローマでGucciのショーにも出演し、夢を叶えることができました。最初の1年は順調でしたが、2年目に入ると鬱に苦しむようになりました。モデル業界は予測が難しく、表面的に感じることも多く、誰を信じればいいのか分からなくなっていきました。人間関係は一時的に感じられ、その環境は精神的にとても消耗するものでした。",
        "ミラノのモデルアパートに滞在していたとき、偶然YouTubeで香港出身のスタンドアップコメディアンの動画に出会いました。その瞬間が人生を変えました。彼の動画をさらに見るようになり、現地のコメディショーにも通い始めました。ファッションモデルとしては、かなり珍しい行動だったと思います。",
        "ミラノとパリのコメディクラブで2年間学んだ後、2024年にパリで初めてオープンマイクに出演しました。それ以来、東京、メルボルン、ミラノ、アムステルダム、ベルリン、香港でステージに立ってきました。5月には、Moxy Tokyo Kinshichoのサポートのおかげで、自分自身の英語スタンドアップコメディショーを始めることができました。",
        "今の目標は、ヨーロッパやアメリカに比べるとまだ機会の少ない東京で、英語スタンドアップコメディのシーンを育てることです。かつての自分と同じように苦しんでいる人たちのために、もっと多くの居場所をつくりたいと思っています。ファッションモデルとしての経験も活かし、コメディとファッション、写真を組み合わせて、コメディの世界に新しいスタイルと価値を生み出していきたいです。",
      ],
      hideStory: "全文を閉じる",
      readStory: "全文を読む",
      creativeDirectorImageLabel: "クリエイティブディレクターのプロフィール画像",
      creativeDirectorImageAlt: "クリエイティブディレクターのプロフィール",
      creativeDirectorRole: "クリエイティブディレクター",
      creativeDirectorName: "SKMNG",
      creativeDirectorIntro:
        "SKMNGは香港生まれ、現在東京を拠点に活動。構成、シルエット、そして何よりも感情的な共鳴を軸に据えた作品をつくる。",
      creativeDirectorStory: [
        "14歳のとき、母のカメラから始まった。それ以来、写真は生涯の信仰となり、時間を留め、はかない瞬間に意味を見出す方法となった。",
        "28mmと43mmの単焦点レンズのみを使用。レンズが求めることは意識を研ぎ澄まし、ズームではなく動きを促し、一歩ごとに新しい視点を見つけ出すこと。",
        "現在はウェブ・グラフィックデザイナーとして活動し、さまざまなクリエイティブ分野を探求しながら、写真への深い情熱を育み続けている。",
      ],
    },
    schedule: {
      eyebrow: "スケジュール",
      title: "今後の公演",
      introPrefix:
        "月4回、原則は月曜始まりの週に1回まで。第1行に水曜がない月は、第2行の金曜の週の次の週の水曜に第1公演を移し、第2公演は第2行の金曜のまま。第3行の水曜が第1公演と同じ日なら、次の行の水曜を第3公演にします。開演は",
      upcomingDates: "今後の日程",
      ticketOptions: "チケットオプション",
      weekdays: ["日", "月", "火", "水", "木", "金", "土"],
      showLabels: {
        week1Wed: "第1週 水曜",
        week2Fri: "第2週 金曜",
        week3Wed: "第3週 水曜",
        week4Fri: "第4週 金曜",
      },
    },
    footer: {
      label: "SNSとアクセス",
      next: "次回",
      instagram: "Instagram",
      googleMaps: "Google Maps",
      comedianSignup: "コメディアン登録",
    },
    tickets: {
      defaultLabel: "チケット",
      openBoxOffice: "チケットを見る",
      bookHere: "WSSCで予約",
      meetup: "Meetup",
      eventbrite: "Eventbrite",
    },
    gallery: {
      emptyPrefix: "画像が見つかりません。画像は次の場所に配置してください:",
    },
    map: {
      eyebrow: "アクセス",
      title: "錦糸町で会場を探す",
      subtitle:
        "モクシー東京錦糸町 — 江東橋・錦糸町、東京都墨田区。",
      venueMarker: "Moxy Kinshicho",
      metroStation: "錦糸町駅",
      walkToMetro: (minutes: number) => `徒歩${minutes}分`,
      unavailableTitle: "Mapboxトークンが必要です",
      unavailableHint:
        "インタラクティブなマップを有効にするには NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN を設定してください。",
    },
    ticketsPage: {
      title: "チケット",
      description:
        "今後の公演やスペシャルイベントをこのサイトから予約できます。決済後、メールで入場コードが届きます。",
      regularShow: "レギュラー公演",
      specialEvent: "スペシャル公演",
      remaining: (count: number) => `残り${count}席`,
      soldOut: "売り切れ",
      priceLabel: (amount: number) => `¥${amount.toLocaleString("ja-JP")}`,
      emailLabel: "メールアドレス",
      nameLabel: "お名前（任意）",
      quantityLabel: "枚数",
      dateLabel: "公演日",
      timeLabel: "時間",
      availabilityLabel: "空席",
      bookButton: "Stripeで予約",
      booking: "決済ページへ移動中…",
      checkoutUnavailable:
        "オンライン決済の準備中です。Stripeのキーを設定すると予約が有効になります。",
      cancelled: "決済はキャンセルされました。カードへの請求はありません。",
      thirdPartyTitle: "外部チケットを使う",
      thirdPartyDescription: "MeetupやEventbriteからも予約できます。",
      backHome: "ホームへ戻る",
      successTitle: "予約完了",
      successDescription:
        "入場時にこのコードを提示してください。決済完了後、同じコードをメールでもお送りしています。",
      successEmailNote: "受信トレイもご確認ください。",
      successPending:
        "お支払いを確認しました。チケットコードを発行中です。少ししてから再読み込みしてください。",
      successMissing:
        "予約が見つかりませんでした。請求されている場合は、領収書とともにご連絡ください。",
      codeLabel: "入場コード",
      quantityNote: (count: number) => `${count}枚`,
    },
  },
} as const;

export type Translation = (typeof i18n)[Language];

export function isLanguage(value: string | null): value is Language {
  return languages.includes(value as Language);
}

export function formatShowDate(date: Date, language: Language) {
  return new Intl.DateTimeFormat(language === "jp" ? "ja-JP" : "en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatMonthTitle(date: Date, language: Language) {
  return new Intl.DateTimeFormat(language === "jp" ? "ja-JP" : "en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}
