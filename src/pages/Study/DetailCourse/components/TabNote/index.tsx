import React from 'react'

type Props = Record<string, unknown>

const TabNote: React.FC<Props> = () => {
  const fakeData = {
    note: `Vestibulum eu quam nec neque pellentesque efficitur id eget nisl
    . Proin porta est convallis lacus blandit pretium sed non enim
    . Maecenas lacinia non orci at aliquam
    . Donec finibus, urna bibendum ultricies laoreet, augue eros luctus sapien
    , ut euismod leo tortor ac enim. In hac habitasse platea dictumst
    . Sed cursus venenatis tellus, non lobortis diam volutpat sit amet
    . Sed tellus augue, hendrerit eu rutrum in, porttitor at metus
    . Mauris ac hendrerit metus. Phasellus mattis lectus commodo felis egestas
    , id accumsan justo ultrices. Phasellus aliquet
    , sem a placerat dapibus, enim purus dictum lacus
    , nec ultrices ante dui ac ante. Phasellus placerat, urna.`,
  }

  return (
    <div className="tab__note">
      <p className="text__title">Ghi chú</p>
      <p className="text__info">{fakeData?.note || ''}</p>
    </div>
  )
}

export default TabNote
