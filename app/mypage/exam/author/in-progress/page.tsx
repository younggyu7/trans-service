'use client';

export default function AuthorInProgressExamsPage() {
  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">출제중인 시험</h1>
          <p className="mt-1 text-sm text-gray-600">
            임시 저장된 출제본 등, 아직 출제를 완료하지 않은 시험을 관리하는 페이지입니다. (추후 상태 구분 로직 추가 예정)
          </p>
        </div>
      </header>

      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="py-12 text-center text-sm text-gray-500 border border-dashed border-gray-200 rounded-lg bg-gray-50">
          현재는 출제중 상태를 구분하는 로직이 없어, 출제중인 시험이 표시되지 않습니다.
          <br />
          출제 상세 페이지와 임시저장 기능을 구현하면서 이 리스트에 노출되도록 연결할 예정입니다.
        </div>
      </section>
    </div>
  );
}
