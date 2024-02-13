import styles from "@/styles/Home.module.css";
import { useState, useRef } from "react";
import { useSignMessage } from 'wagmi'
import { recoverMessageAddress } from 'viem'

export default function Register() {
	const [isNetworkSwitchHighlighted, setIsNetworkSwitchHighlighted] =
		useState(false);
	const [isConnectHighlighted, setIsConnectHighlighted] = useState(false);
	const [gateway, setGateway] = useState("https://rpc.walletconnect.com");
	const [payloadMessage, setPayloadMessage] = useState<string | undefined>();
	const [signature, setSignature] = useState<`0x${string}`>();

	const { signMessage, data, error, isLoading } = useSignMessage({
		message: 'Please sign this message to confirm your identity.',
		onSuccess(data) {
			console.log('Message signed:', data);
			setSignature(data);
		},
		onError(error) {
			alert('Error signing message');
		},
	});

		const nameInputRef = useRef<HTMLInputElement>(null);
		const bioInputRef = useRef<HTMLInputElement>(null);

	const closeAll = () => {
		setIsNetworkSwitchHighlighted(false);
		setIsConnectHighlighted(false);
	};

	const sign = () => {
		const name = nameInputRef.current?.value;
		const bio = bioInputRef.current?.value;
		const timestamp = Math.round(Date.now() / 1000)
		const sign_message = {
			name: name,
			attributes: {
				...(bio ? { bio } : {})
			},
			timestamp: timestamp,
		}
		const json_to_sign = JSON.stringify(sign_message)
		signMessage({message: json_to_sign})
		setPayloadMessage(json_to_sign);
	}

		const handleGatewayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
			setGateway(event.target.value);
		};

	const handleRegister = async () => {
		const recoveredAddress = await recoverMessageAddress({
			message: payloadMessage ? payloadMessage : '',
			signature: signature ? signature : Uint8Array.from([]),
		})

		const data = {
			message: payloadMessage ? payloadMessage : '',
			signature: signature ? signature : '',
			coin_type: 60,
			address: recoveredAddress,
		};

    try {
      const response = await fetch(`${gateway}/v1/profile/account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.status !== 200) {
        const responseData = await response.json();
        for (const key in responseData.reasons) {
          alert(`Error field: ${responseData.reasons[key].field}\nError description: ${responseData.reasons[key].description}`);
        }
      } else {
        const responseData = await response.json();
        alert('Name successfully registered!');
      }
    } catch (error) {
      console.error('Error sending the POST request:', error);
      alert('Failed to send the POST request.');
    }
  };

	return (
			<main className={styles.main}>
				<div className={styles.wrapper}>
					<div className={styles.container}>
						<h1>Register the Name</h1>
						<div className={styles.content}>
							<ul>
								<li>
									Enter the name to register
								</li>
								<li>
									<input type="text" id="name" name="name" ref={nameInputRef} />
								</li>
								<li>
									Bio attribute (optional)
								</li>
								<li>
									<input type="text" id="bio" name="bio" ref={bioInputRef} />
								</li>
								<li>
									Gateway (optional)
								</li>
								<li>
									<input type="text" id="gateway" name="gateway" value={ gateway } onChange={handleGatewayChange} />
								</li>
								<li>
									Click{" "}
									<span
										onClick={sign}
										className={styles.button}
									>
										to sign message
									</span>{" "}
								</li>
								<li>
									Signature is valid for 10 seconds.
								</li>
								<li>
									Click{" "}
									<span
										onClick={handleRegister}
										className={styles.button}
									>
										to register
									</span>{" "}
								</li>
							</ul>
						</div>
					</div>
					<div className={styles.footer}>
					</div>
				</div>
			</main>
	);
}
