<x-app>
    <h1>{ opts.title }</h1>
    
    <ol>
        <li each={ option in items }>
            { option }
        </li>
    </ol>
    
    <form>
        <label>
            Your wish is:
        </label>
        <div>
                <input type="text" ref="wish" />
        </div>
        <div>
            <button type="button" onclick="{ add }">Submit</button>
        </div>
        
    </form>
    <style>
        input {
            padding: 5px;
            border: solid 1px #ccc;   
        }
        form > div {
            margin: 0.5em 0;
        }
    </style>
    <script src="wish.js"></script>
    <script src="mixin.coffee" type="coffee"></script>
</x-app>
