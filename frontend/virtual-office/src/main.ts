
import Phaser from 'phaser'

class OfficeScene extends Phaser.Scene {
  private avatar!: Phaser.GameObjects.Arc
  private avatarBody!: Phaser.Physics.Arcade.Body
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private keys!: Record<string, Phaser.Input.Keyboard.Key>

  // PC操作用の状態
  private isUsingPC = false
  private pcTarget: Phaser.Math.Vector2 | null = null
  private pcScreen!: Phaser.GameObjects.Rectangle
  private pcPanel!: Phaser.GameObjects.Container

  constructor() {
    super('OfficeScene')
  }

  create() {
    // ===== オフィスの床 =====

    this.add.rectangle(
      480, 300, 920, 560, 0xe8edf2
    ).setStrokeStyle(4, 0x344054)

    // ===== AI研究室 =====

    this.add.rectangle(
      230, 170, 350, 200, 0xc9ddf5
    ).setStrokeStyle(3, 0x344054)

    this.add.text(110, 100, 'AI LAB', {
      fontSize: '24px',
      color: '#243b53'
    })

    // ===== ロボティクス研究室 =====

    this.add.rectangle(
      730, 170, 350, 200, 0xd4eadb
    ).setStrokeStyle(3, 0x344054)

    this.add.text(600, 100, 'ROBOTICS LAB', {
      fontSize: '24px',
      color: '#243b53'
    })

    // ===== 開発室 =====

    this.add.rectangle(
      480, 440, 700, 220, 0xf5e5c9
    ).setStrokeStyle(3, 0x344054)

    this.add.text(160, 360, 'DEVELOPMENT ROOM', {
      fontSize: '24px',
      color: '#59452a'
    })

    // ===== アバター =====

    this.avatar = this.add.circle(
      480, 440, 18, 0x7254c7
    )

    this.physics.add.existing(this.avatar)

    this.avatarBody =
      this.avatar.body as Phaser.Physics.Arcade.Body

    this.avatarBody.setCircle(18)
    this.avatarBody.setCollideWorldBounds(true)

    this.add.circle(480, 434, 7, 0xffffff)

    this.add.text(505, 430, 'You', {
      fontSize: '18px',
      color: '#243b53'
    })

    // ===== 物理オブジェクト =====

    const obstacles = this.physics.add.staticGroup()

    // 壁を作る共通処理
    const addWall = (
      x: number,
      y: number,
      width: number,
      height: number
    ) => {
      const wall = this.add.rectangle(
        x, y, width, height, 0x344054
      )

      obstacles.add(wall)
    }

    // ===== AI LABの壁 =====

    addWall(230, 70, 350, 12)
    addWall(55, 170, 12, 200)
    addWall(230, 270, 350, 12)

    // 右側：ドアの通路
    addWall(405, 110, 12, 80)
    addWall(405, 243, 12, 66)

    // ===== ROBOTICS LABの壁 =====

    addWall(730, 70, 350, 12)
    addWall(905, 170, 12, 200)
    addWall(730, 270, 350, 12)

    // 左側：通路
    addWall(555, 110, 12, 80)
    addWall(555, 243, 12, 66)

    // ===== DEVELOPMENT ROOMの壁 =====

    addWall(130, 440, 12, 220)
    addWall(830, 440, 12, 220)
    addWall(480, 550, 700, 12)

    // 上側：通路
    addWall(280, 330, 300, 12)
    addWall(680, 330, 300, 12)

    // ===== AI LAB PC =====

    // PC本体
    this.add.rectangle(
      230, 170, 60, 40, 0x475569
    )

    // PC画面
    this.pcScreen = this.add.rectangle(
      230, 162, 42, 22, 0x1e293b
    )

    // PCの操作範囲
    const pcSensor = this.add.zone(
      230, 210, 100, 80
    )

    // ===== PC操作パネル =====

    const panelBackground = this.add.rectangle(
      0, 0, 420, 260, 0x101828, 0.97
    )
    .setStrokeStyle(3, 0x64748b)

    const panelTitle = this.add.text(
      -185, -105,
      'ROBOT MANAGEMENT',
      {
        fontSize: '22px',
        color: '#ffffff',
        fontStyle: 'bold'
      }
    )

    const robotStatus = this.add.text(
      -185, -45,
      'Robot ID: robot-001\nStatus: Running\nCPU Usage: 35%\nMemory Usage: 62%',
      {
        fontSize: '18px',
        color: '#d1d5db',
        lineSpacing: 12
      }
    )

    const closeHint = this.add.text(
      -185, 100,
      'Press E to close',
      {
        fontSize: '14px',
        color: '#94a3b8'
      }
    )

    this.pcPanel = this.add.container(
      480, 300,
      [
        panelBackground,
        panelTitle,
        robotStatus,
        closeHint
      ]
    )

    this.pcPanel.setDepth(1000)
    this.pcPanel.setVisible(false)

    // EキーでPC操作
      this.input.keyboard!.on('keydown-E', () => {

  // PC操作中なら終了する
    if (this.isUsingPC) {
      this.isUsingPC = false
      this.pcTarget = null

      this.pcScreen.setFillStyle(0x1e293b)
      this.pcPanel.setVisible(false)

      console.log('PCを終了しました')
      return
    }

    // PCの近くにいるか確認
    const nearPC = Phaser.Geom.Intersects.RectangleToRectangle(
      this.avatar.getBounds(),
      pcSensor.getBounds()
    )

    if (!nearPC) return

    // PCの前まで移動する
    this.pcTarget = new Phaser.Math.Vector2(230, 215)

    })

    // ===== AI LAB 自動ドア =====

    const door = this.add.rectangle(
      405, 180, 12, 60, 0x8b5cf6
    )

    obstacles.add(door)

    // ドアの接近センサー
    const doorSensor = this.add.zone(
      405, 180, 100, 100
    )

    this.physics.add.existing(doorSensor, true)

    // ドアの通路センサー
    const doorwaySensor = this.add.zone(
      405, 180, 40, 60
    )

    this.physics.add.existing(doorwaySensor, true)

    let doorOpen = false

    let doorClosingTimer:
      Phaser.Time.TimerEvent | undefined

    // ドアに近づいたら開く
    this.physics.add.overlap(
      this.avatar,
      doorSensor,
      () => {
        // 閉じるタイマーをキャンセル
        doorClosingTimer?.remove()
        doorClosingTimer = undefined

        if (doorOpen) return

        doorOpen = true

        const body =
          door.body as Phaser.Physics.Arcade.StaticBody

        body.enable = false

        this.tweens.add({
          targets: door,
          y: 110,
          duration: 400,
          ease: 'Power2'
        })
      }
    )

    // ドアを閉じるか確認する処理
    const checkDoorClosing = () => {

      if (!doorOpen || doorClosingTimer) return

      // ドアの近くにいるか確認
      const nearDoor =
        Phaser.Geom.Intersects.RectangleToRectangle(
          this.avatar.getBounds(),
          doorSensor.getBounds()
        )

      if (nearDoor) return

      // 2秒後に確認
      doorClosingTimer = this.time.delayedCall(
        2000,
        () => {

          doorClosingTimer = undefined

          // 再度ドアの近くを確認
          const nearDoorNow =
            Phaser.Geom.Intersects.RectangleToRectangle(
              this.avatar.getBounds(),
              doorSensor.getBounds()
            )

          // 通路にいるか確認
          const inDoorway =
            Phaser.Geom.Intersects.RectangleToRectangle(
              this.avatar.getBounds(),
              doorwaySensor.getBounds()
            )

          // 人がいれば2秒後に再確認
          if (nearDoorNow || inDoorway) {
            doorClosingTimer = this.time.delayedCall(
              2000,
              checkDoorClosing
            )

            return
          }

          // ドアを閉じる
          this.tweens.add({
            targets: door,
            y: 180,
            duration: 400,
            ease: 'Power2',

            onComplete: () => {
              const body =
                door.body as Phaser.Physics.Arcade.StaticBody

              body.enable = true
              body.updateFromGameObject()

              doorOpen = false
            }
          })
        }
      )
    }

    // 毎フレーム、ドアの状態を確認
    this.events.on('update', checkDoorClosing)

    // ===== アバターと壁の衝突 =====

    this.physics.add.collider(
      this.avatar,
      obstacles
    )

    // ===== タイトル =====

    this.add.text(30, 20, 'VIRTUAL OFFICE', {
      fontSize: '26px',
      color: '#243b53',
      fontStyle: 'bold'
    })

    // ===== キー設定 =====

    this.cursors =
      this.input.keyboard!.createCursorKeys()

    this.keys = this.input.keyboard!.addKeys(
      'W,A,S,D,E'
    ) as Record<string, Phaser.Input.Keyboard.Key>
  }

  // ===== 毎フレームの処理 =====

  update() {

    // PCの前に自動移動中
    if (this.pcTarget) {

      const direction = new Phaser.Math.Vector2(
        this.pcTarget.x - this.avatar.x,
        this.pcTarget.y - this.avatar.y
      )

      // 目標地点に到着
      if (direction.length() < 4) {

        this.avatarBody.setVelocity(0, 0)

        this.pcTarget = null
        this.isUsingPC = true

        // PC画面を点灯
        this.pcScreen.setFillStyle(0x22c55e)
        this.pcPanel.setVisible(true)

        return
      }

      // 目標地点に向かって移動
      direction.normalize().scale(180)

      this.avatarBody.setVelocity(
        direction.x,
        direction.y
      )

      return
    }

    // PC操作中は移動しない
    if (this.isUsingPC) {
      this.avatarBody.setVelocity(0, 0)
      return
    }

    // ===== 通常移動 =====

    const speed = 180

    let vx = 0
    let vy = 0

    if (
      this.cursors.left.isDown ||
      this.keys.A.isDown
    ) {
      vx = -speed
    }

    if (
      this.cursors.right.isDown ||
      this.keys.D.isDown
    ) {
      vx = speed
    }

    if (
      this.cursors.up.isDown ||
      this.keys.W.isDown
    ) {
      vy = -speed
    }

    if (
      this.cursors.down.isDown ||
      this.keys.S.isDown
    ) {
      vy = speed
    }

    // 斜め移動が速くなりすぎないようにする
    const velocity = new Phaser.Math.Vector2(vx, vy)

    if (velocity.length() > 0) {
      velocity.normalize().scale(speed)
    }

    this.avatarBody.setVelocity(
      velocity.x,
      velocity.y
    )
  }
}

// ===== ゲーム設定 =====

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 960,
  height: 600,
  parent: 'app',
  backgroundColor: '#e8edf2',

  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },

  scene: OfficeScene
}

new Phaser.Game(config)
