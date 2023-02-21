import { act, fireEvent, render, screen } from "@testing-library/react"

import { AsyncCounter } from "./"

describe("AsyncCounter", () => {
  test("render", () => {
    const { asFragment } = render(<AsyncCounter />)
    expect(asFragment()).toMatchSnapshot()
  })

  describe("click:count:カウントアップ", () => {
    test("ボタン押下 1 秒後のtextは「AsyncCount: 1」", () => {
      // AsyncCounterのクリックイベントにはsetTimeoutで1000mm秒後のカウントアップが設定されている
      // asinc/awaitでsleep関数を作成し、1秒待つことも可能であるが時間効率が悪い
      jest.useFakeTimers()
      render(<AsyncCounter />)
      // 描画されたtextからDOMを取得する関数
      const button = screen.getByText("AsyncIncrement")
      fireEvent.click(button)
      act(() => {
        // 待機時間を経過させる。setTimeout, setIntervalなど
        jest.runAllTimers()
      })
      screen.getByText("AsyncCount: 1")
      // useFakeTimersの使用を終了する
      jest.useRealTimers()
    })
  })

  /*
    setTimeout(() => console.log("timeout"))
    Promise.resolve().then(() => console.log("resolved"))
    console.log("sync")
    通常タスク->マクロタスク->マイクロタスク
    上記なら、sync -> resolved -> timeout の順に出力
  */

  describe("click:count:ボタン活性・非活性", () => {
    test("ボタン押下直後はボタンが非活性", () => {
      render(<AsyncCounter />)
      const button = screen.getByText("AsyncIncrement")
      fireEvent.click(button)
      expect(button).toBeDisabled()
    })
    test("ボタン押下 1 秒後はボタンが活性", () => {
      jest.useFakeTimers()
      render(<AsyncCounter />)
      const button = screen.getByText("AsyncIncrement")
      fireEvent.click(button)
      act(() => {
        // 全ての待機時間を経過させる
        jest.runAllTimers()
      })
      //  React state updates should be wrapped into act(...)
      expect(button).not.toBeDisabled()
      // 時間経過を戻す
      jest.useRealTimers()
    })
  })

  describe("click:count:ローディング UI", () => {
    test("ボタン押下直後はローディングが表示", () => {
      render(<AsyncCounter />)
      const button = screen.getByText("AsyncIncrement")
      fireEvent.click(button)
      expect(screen.queryByText("...Loading")).toBeInTheDocument()
    })
    test("ボタン押下直後はローディングが非表示", () => {
      jest.useFakeTimers()
      render(<AsyncCounter />)
      const button = screen.getByText("AsyncIncrement")
      fireEvent.click(button)
      act(() => {
        jest.runAllTimers()
      })
      expect(screen.queryByText("...Loading")).not.toBeInTheDocument()
      jest.useRealTimers() /** 時を戻そう */
    })
  })
})
