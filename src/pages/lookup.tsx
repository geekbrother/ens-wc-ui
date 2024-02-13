import styles from "@/styles/Home.module.css";
import { useState, useRef } from "react";
import { useSignMessage } from 'wagmi'
import { recoverMessageAddress } from 'viem'

export default function Lookup() {
	const [lookupResponse, setLookupResponse] = useState<string>();
  const nameInputRef = useRef(null);
  const addressInputRef = useRef(null);
  const [gateway, setGateway] = useState("https://rpc.walletconnect.com");

  const handleGatewayChange = (event) => {
    setGateway(event.target.value);
  };

  const handleNameLookup = async () => {
    const name = nameInputRef.current.value

    try {
      const response = await fetch(`${gateway}/v1/profile/account/${name}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        setLookupResponse("Name not found");
      } else if (response.status === 200) {
         const responseData = await response.json();
         setLookupResponse(JSON.stringify(responseData, null, 2));
      } else {
        const responseData = await response.json();
        for (const key in responseData.reasons) {
          alert(`Status code:${response.status}\nError field: ${responseData.reasons[key].field}\nError description: ${responseData.reasons[key].description}`);
        }
        setLookupResponse(JSON.stringify(responseData, null, 2));
      }
    } catch (error) {
      console.error('Error sending the POST request:', error);
      alert('Failed to send the POST request.');
    }
  };


  const handleAddressLookup = async () => {
    const name = addressInputRef.current.value

    try {
      const response = await fetch(`${gateway}/v1/profile/reverse/${name}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        setLookupResponse("Name not found");
      } else if (response.status === 200) {
         const responseData = await response.json();
         setLookupResponse(JSON.stringify(responseData, null, 2));
      } else {
        const responseData = await response.json();
        for (const key in responseData.reasons) {
          alert(`Error field: ${responseData.reasons[key].field}\nError description: ${responseData.reasons[key].description}`);
        }
        setLookupResponse(JSON.stringify(responseData, null, 2));
      }
    } catch (error) {
      console.error('Error sending the POST request:', error);
      setLookupResponse("Failed to send the POST request.");
      alert('Failed to send the POST request.');
    }
  };

	return (
			<main className={styles.main}>
				<div className={styles.wrapper}>
					<div className={styles.container}>
						<h1>Lookup</h1>
						<div className={styles.content}>
							<ul>
								<li>
									Enter the name to lookup
								</li>
								<li>
									<input type="text" id="name" name="name" ref={nameInputRef} />
								</li>
                <li>
									Click{" "}
									<span
										onClick={handleNameLookup}
										className={styles.button}
									>
										to lookup by name
									</span>{" "}
								</li>
								<li>
									Enter the address to lookup
								</li>
								<li>
									<input type="text" id="address" name="address" ref={addressInputRef} />
								</li>
								<li>
									Click{" "}
									<span
										onClick={handleAddressLookup}
										className={styles.button}
									>
										to lookup by address
									</span>{" "}
								</li>
                <li>
									Gateway (optional)
								</li>
								<li>
									<input type="text" id="gateway" name="gateway" value={ gateway } onChange={handleGatewayChange} />
								</li>
							</ul>
						</div>
					</div>
					<div className={styles.footer}>
            <pre>
             {lookupResponse}
            </pre>
					</div>
				</div>
			</main>
	);
}
