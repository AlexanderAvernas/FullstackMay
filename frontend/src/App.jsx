import './App.css'
import axios from 'axios'
import {useState, useEffect} from 'react'
function App() {

    const [data, setData] = useState([])
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        axios.get('http://localhost:8900/persons')
        .then(response => {
            setData(response.data)
        })
    .catch(() => {
        //handle error
    });
    }, []);

    //post data
    const [formData, setFormData] = useState({
        FirstName: '',
        LastName: '',
        Address: '',
        City: ''
    });

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name] : event.target.value
        })
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8900/persons/form', formData)
        .then(() => {
            //hantera success
            setSuccess(true);
        })
        .catch(() => {
            //handle errors
        })
    }

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8900/persons/${id}`)
            window.location.reload()
        }catch (err) {
            console.log(err);
        }
    }


  return (
    <>
    <div>
        <form onSubmit={handleSubmit}>
            <label>
                FirstName:
                <input type="text" name="FirstName" onChange={handleChange}/>
            </label>
            <br />
            <label>
                LastName:
                <input type="text" name="LastName" onChange={handleChange}/>
            </label>
            <br />
            <label>
                Address:
                <input type="text" name="Address" onChange={handleChange}/>
            </label>
            <br />
            <label>
                City
                <input type="text" name="City" onChange={handleChange}/>
            </label>
            <br />
            <button type='submit'>Submit</button>
            <div>
                {success && <p>Form submitted</p>}
            </div>
        </form>

        {data.map(item => (
            <div key={item.id}>
                <p>{item.firstname} {item.lastname} <button onClick={() => handleDelete(item.id)}>Delete</button></p>
            </div>
        ))}
    </div>
    </>
  )
}

export default App
