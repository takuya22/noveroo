export const UserTypesSection = () => {
  const userTypes = [
    {
      name: '教育者',
      description: '生徒が楽しみながら学べる教材を簡単に作成。英語や歴史など、あらゆる教科に応用できます。',
      image: '/images/teacher.jpg',
      quote: '「授業で使えるインタラクティブな教材をこんなに簡単に作れるなんて！生徒の反応が全然違います」',
      person: '三浦 理恵（中学校教師）',
    },
    {
      name: '創作活動を楽しむ学生',
      description: 'アイデアをすぐに形にできるプラットフォーム。SNSで共有して友人と一緒に楽しめます。',
      image: '/images/student.jpg',
      quote: '「自分のアイデアをゲームにするのが夢だったけど、プログラミングは苦手で...。ノベルーなら思いついたらすぐ形にできます！」',
      person: '原田 誠（大学生）',
    },
    {
      name: 'シニアクリエイター',
      description: '長年温めてきたストーリーや経験を、新しい形で表現。家族や地域の仲間と共有できます。',
      image: '/images/senior.jpg',
      quote: '「定年後に書き始めた小説を、孫たちが実際に「プレイ」できるゲームにできて感動しています。新しい挑戦が楽しいです」',
      person: '斉藤 正雄（66歳）',
    },
  ];

  return (
    <div id="templates" className="py-24 sm:py-32 bg-[var(--gray-50)]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-[var(--primary)]">様々な方に使われています</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl">
            あらゆる年代、目的に対応
          </p>
          <p className="mt-6 text-lg leading-7 text-gray-600">
            Noverooは幅広いユーザーに利用されています。教育者、学生、シニア層まで、それぞれの目的に合わせた機能で創作活動をサポートします。
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {userTypes.map((userType, index) => (
            <article key={index} className="flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-md transition-shadow hover:shadow-lg">
              <div className="h-48 relative bg-gradient-to-r from-[var(--primary-light)] to-[var(--secondary-light)]">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-white/10 backdrop-blur-sm">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center mb-3 shadow-sm">
                    {index === 0 ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="var(--primary)" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
                      </svg>
                    ) : index === 1 ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="var(--secondary-dark)" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="var(--primary)" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{userType.name}</h3>
                </div>
              </div>
              
              <div className="flex-grow p-6 flex flex-col">
                <p className="text-base text-gray-600 mb-6">
                  {userType.description}
                </p>
                
                <div className="mt-auto pt-6 border-t border-gray-100">
                  <blockquote className="text-sm italic text-gray-700 mb-2">
                    {userType.quote}
                  </blockquote>
                  <div className="text-sm font-medium text-gray-800">
                    {userType.person}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
