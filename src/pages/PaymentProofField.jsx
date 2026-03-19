export default function PaymentProofField({ method, onChange }) {
  if (method === "onsport") return null;

  return (
    <div>
      <label className="block mb-2 font-semibold">
        Upload Payment Proof
      </label>

      <input type="file" onChange={(e)=>onChange(e.target.files[0])}/>
    </div>
  );
}