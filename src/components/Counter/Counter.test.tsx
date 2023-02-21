import { fireEvent, render, screen } from "@testing-library/react"

import { Counter } from "./"

describe("Counter", () => {
  test("render", () => {
    // レンダリング対象DOMをasFragmentオブジェクトへ
    const { asFragment } = render(<Counter />)
    // テスト用DOM要素が描画されているかテストし状態を保存
    // 以降の呼び出しはスナップショットから静的ファイルを実行する
    expect(asFragment()).toMatchSnapshot()
  })
  test("click:count", () => {
    render(<Counter />)
    const button = screen.getByText("Increment")
    fireEvent.click(button)
    fireEvent.click(button)
    screen.getByText("Count: 2")
  })
})
