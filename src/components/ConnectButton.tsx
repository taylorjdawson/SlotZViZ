"use client"

import { ButtonHTMLAttributes, ReactNode, useEffect, useState } from "react"
import { useConnectWallet } from "@web3-onboard/react"
import { v4 as uuid } from "uuid"
import { WalletClient, createWalletClient, custom } from "viem"
import { TokenSymbol } from "@web3-onboard/common"
import { genNonce } from "@/lib/nonce"
import { login } from "@/lib/login"

import supabase from "@/lib/supabaseClient"
import useAppState from "@/lib/hooks/useAppState"
import { useRouter } from "next/router"

interface ButtonState {
  text: string
  className: string
}

const STATE: Record<string, ButtonState> = {
  DISCONNECTED: {
    text: "connect",
    className: "border-[#F80B52] hover:shadow-glow hover:border-[#ff8cae]",
  },
  CONNECTED: {
    text: "assimilate",
    className:
      "border-[#B1FF0C] hover:shadow-glow-yella hover:border-[#dbfd92]",
  },
  LOGGEDIN: {
    text: "disassimilate",
    className: "border-[#F80B52] hover:shadow-glow hover:border-[#ff8cae]",
  },
}

interface Account {
  address: string
  balance: Record<TokenSymbol, string> | null
  ens: { name: string | undefined; avatar: string | undefined }
}

const ConnectButton: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className,
  ...props
}) => {
  // const router = useRouter()
  const { state, setState } = useAppState()

  const [account, setAccount] = useState<Account>()
  const [walletClient, setWalletClient] = useState<WalletClient>()

  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()

  const [buttonState, setButtonState] = useState<ButtonState>(
    STATE.DISCONNECTED
  )

  useEffect(() => {
    if (wallet?.provider) {
      if (state.user) {
        setButtonState(STATE.LOGGEDIN)
      } else {
        setButtonState(STATE.CONNECTED)
      }
    } else {
      setButtonState(STATE.DISCONNECTED)
    }
  }, [wallet?.provider, state.user])

  useEffect(() => {
    if (wallet?.provider) {
      const { name, avatar } = wallet?.accounts[0].ens ?? {}
      setAccount({
        address: wallet.accounts[0].address as `0x${string}`,
        balance: wallet.accounts[0].balance,
        ens: { name, avatar: avatar?.url },
      })
    }
  }, [wallet])

  useEffect(() => {
    if (wallet?.provider) {
      setWalletClient(
        createWalletClient({
          transport: custom(wallet?.provider),
        })
      )
    }
  }, [setWalletClient, wallet?.provider])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    if (wallet !== null) {
      disconnect(wallet)
    }
    // router.reload()
  }

  return (
    <>
      {/* {wallet?.provider && account ? (
        <div>
          {account.ens?.avatar ? (
            <img src={account.ens?.avatar} alt="ENS Avatar" />
          ) : null}
          <div>{account.ens?.name ? account.ens.name : account.address}</div>
          <div>Connected to {wallet.label}</div>
          <button
            onClick={() => {
              disconnect({ label: wallet.label })
            }}
          >
            Disconnect
          </button>
        </div>
      ) : (
        
      )} */}
      <button
        //   style={{
        //     border: "1px solid #eecbff",
        //     boxShadow:
        //       "0 0 10px 2px #5e38ff, 0 4px 80px rgba(147,64,223,.6), inset 0 0 10px 2px #5e38ff, inset 0 4px 40px rgba(147,64,223,.6)",
        //   }}
        className={`${buttonState.className} border absolute top-12 right-12  border-opacity-70 rounded   transition-all px-4 py-1`}
        disabled={connecting}
        onClick={async () => {
          if (wallet?.provider && account && walletClient && buttonState.text === "assimilate") {
            const { message } = await genNonce(account.address as `0x{string}`)

            const [acct] = await walletClient.getAddresses()
            const signature = await walletClient.signMessage({
              account: acct,
              message,
            })

            const token = await login({ signedMsg: signature, address: acct })

            const session = {
              access_token: token,
              refresh_token: uuid(),
            }

            const { data: result, error } = await supabase.auth.setSession(
              session
            )
            if (result.user) {
              setState({ ...state, user: result.user })
            }
            console.log({ result, error })
          } else if (buttonState.text === "disassimilate") {
            handleSignOut()
          } else {
            connect()
          }
        }}
      >
        {buttonState.text}
      </button>
    </>
  )
}

// {
//  "--w3o-background-color": "#00061f",
// "--w3o-foreground-color": "#404040",
// "--w3o-text-color": "#ffffff",
// "--w3o-border-color": "#f80b52",
// "--w3o-action-color": "unset",
// "--w3o-border-radius": "4px",
// "--w3o-font-family": "fira-code",
// }

export default ConnectButton
