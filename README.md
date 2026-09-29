#Military Grade: TacticalHUD

Standard Pomodoro apps are built for corporate office workers. They were not designed for the trenches of preparation. They pause your timer when Chrome puts a 12-hour one-shot lecture tab to sleep. They treat a brutal PYQ problem the same as "buy groceries." They don't understand what it means to be buried under a massive backlog or be under immense pressure.

Military Grade Timer is different. It is a high-octane, uncompromising execution environment built strictly for serious aspirants. It doesn’t just track time; it enforces discipline, protects your momentum, and keeps your eyes locked on the ultimate target.

When you uncap the pen and open that notebook, this app serves as your mission control.

## ⚙️ Tactical Features Engineered for Aspirants
Deep-Sleep Proof Architecture: Built with a background Blob Web Worker, this timer is virtually un-killable. Whether you are minimizing the window, switching to a heavy 3D application, or leaving a lecture running in the background for hours, the timer continues its countdown with absolute precision. Browser throttling will never save you from a focus block again.

Backlog & Subject Stacking: Stop treating all tasks equally. Tag your targets by Physics, Chemistry, or Math, or any other subject and apply the independent, glowing-red Backlog modifier. You know exactly what missions are holding you back and what needs to be neutralized today.

Priority Target Locking: Some targets make or break the day. Mark them with the animated Priority Star, and they instantly jump to the top of your execution list, surrounded by a glowing alert border.

Psychological Friction for Breaks: Momentum is everything. When a block ends, you can take a 5-minute breather. But if you request a 15-minute deep rest, the app initiates an aggressive "Are You Sure???" protocol. It forces you to pause, look at a bouncing red alert, and actively confirm that you actually earned the right to break your momentum.

Mission Logs (Historical Recon): A slick Dynamic Island navigation bar lets you seamlessly toggle between your active execution screen and your Mission Logs. The interactive calendar permanently records every target you successfully executed on any given day. Years from now, you will be able to look back and see exactly what you accomplished on this exact date.

The Mentality: Featuring a dark glassmorphism aesthetic, customizable typography (Sans, Serif, Mono) for your targets, and rotating finisher mentalities like M.S. Dhoni's "Till the full stop doesn't come, the sentence is not complete."

The protocol is simple: Lock on a target. Start the timer. Execute.

## ⚙️ Architecture & Mechanism (For Developers)

This application is designed as a lightweight, client-side-only React application with a specific focus on bypassing browser limitations for long-running background tasks. 

### Core Systems

**1. Deep-Sleep Proof Timer (Inline Web Worker)**
Modern browsers aggressively throttle `setInterval` and `setTimeout` in inactive background tabs, limiting them to roughly 1 execution per minute. To guarantee exact timing during marathon focus blocks:
* The countdown logic is offloaded to a dedicated Web Worker thread.
* To avoid the friction of managing separate static worker files during Vite builds, the worker is instantiated inline using a `Blob` object and `URL.createObjectURL`.
* The main React thread sends `start`/`stop` messages, and the worker posts back a `tick` every 1000ms. The main thread listens for these messages to update the UI, completely bypassing tab-throttling limits.

**2. State Management & Local Persistence**
* The application is built using a monolithic component structure for rapid deployment, relying heavily on `useState`, `useEffect`, and `useRef`.
* Zero backend configuration is required. Data persistence is handled via the browser's `localStorage` API. 
* The `tasks` array is serialized to JSON and synced automatically on every state mutation via a dedicated `useEffect` hook. 
* **Data Schema:** Each target object tracks `id` (timestamp), `text`, `done` (boolean), `cat` (subject string), `backlog` (boolean), `font` (Tailwind class string), `prio` (boolean), and `date` (YYYY-MM-DD string).

**3. Execution Logic & Rendering**
* **Dynamic Sorting Algorithm:** The task list is automatically sorted on every render. Active priority targets (`prio: true`) are hoisted to the top index. Completed targets (`done: true`) are pushed to the bottom and visually muted using CSS opacity transitions.
* **Component Routing:** The floating Dynamic Island navigation toggles a state variable (`tab`), conditionally mounting either the Execution dashboard or the Calendar grid. This avoids the overhead of installing a dedicated routing library.
* **Historical Logging:** The calendar grid calculates the days of the active month dynamically. Clicking a specific day filters the `localStorage` JSON array by the corresponding `date` string, instantly rendering a historical modal of that day's operations.

**4. Styling & UI Engine**
* The UI leverages Tailwind CSS. For the local deployment setup, it utilizes the Tailwind CDN script inside `index.html` to eliminate build-step complexity.
* The design system relies heavily on arbitrary Tailwind values (e.g., `shadow-[0_0_15px_rgba(...)]`) mixed with generic background blurs (`backdrop-blur-md`) to achieve the dark glassmorphism aesthetic.
* User interactions (like prioritizing a task or switching subjects) trigger state-driven template literals that dynamically swap utility classes for real-time glowing feedback.


## 💻 First-Time Setup (For Non-Programmers)

If you are an aspirant who has never coded before, you don't need to worry about installing React or Vite manually. The built-in "blueprint" (`package.json`) handles all of that. You just need to install the core engine that runs JavaScript on your computer.

1. **Install Node.js:** 
   * Go to [nodejs.org](https://nodejs.org/).
   * Download and install the "LTS" (Long Term Support) version for your operating system (Windows/Mac).
   * *Note: Installing Node.js automatically installs `npm` (Node Package Manager), which is the tool that will download React and all other required files for you.*
2. **Get a Code Editor:**
   * Download and install [Visual Studio Code (VS Code)](https://code.visualstudio.com/). This is where you will open the files to change your subjects and target goals.
3. **Download This Code:**
   * Click the green **"<> Code"** button at the top of this repository and select **Download ZIP**.
   * Extract the ZIP file to your Desktop.
4. Open the extracted folder in VS Code, open a new Terminal inside VS Code (`Terminal > New Terminal`), and follow the **Local Deployment** steps below.


## ⚙️ Local Deployment

If you want to run this execution environment on your own machine:

1. Clone this repository:
   ```bash
   git clone [https://github.com/mr-recreator/Planner_=Milliatry_Grade.git](https://github.com/YOUR_USERNAME/jee-focus-planner.git)
   ```
   (If you have not downloaded the zip)

2.Navigate into the app's directory:
```bash
cd jee-planner
```
3.Install required dependencies
```bash
npm install
```
4.Run the Development Server:
```bash
npm run dev
```

Keep in mind that the available scripts and their functionality are defined in the project's package.json file. The above instructions assume that you have Node.js and npm installed on your system.


## Steps to change the background:

1.Navigate into the app's directory: Go to the apps directory then go to the public directory.
2.Replace the image: Replace "image_38a99e.jpg" with your image.
NOTE: MAKESURE TO RENAME YOUR IMAGE AS "image_38a99e.jpg".

## If you are preparing for any other exam or you have another goal then you can customize it as follows:

If you are preparing for a different mission, you can easily adapt the code with the same engine:

### 1.Change the tags(subjects):
  1.1.**Open the `src/App.tsx` file in your code editor.**
  1.2.Look for this code(around line 12) alternatively you can use the find feature to find the code:
```tsx
const [cat, setCat] = useState('Physics');
```
  1.3. Change Physics to any subject you want.
  1.4.Now around line 113 here also you can use the find and replace feature look for this code:
```tsx
{['Physics', 'Chemistry', 'Math'].map(c => <button key={c} onClick={()=>setCat(c)} ........
```
  1.5.Change Physics, Chemistry and Math to the subjects you want for example:
```tsx
{['Writing', 'History', 'Biology'].map(c => <button key={c} onClick={()=>setCat(c)}
```
  1.6.Save the file.

### 2.Change the footer(Target and motivational quotes):
The bottom of the screen acts as your HUD, constantly displaying your ultimate goal to keep you locked in during long hours. Here is how to change it to your own dream institution:
  2.1.**Open the `src/App.tsx` file in your code editor.**
  
  2.2.Scroll to the very bottom of the file (look for the `{/* Status Footer */}` comment around line 170).
  
  2.3.You will find a line of code that looks exactly like this(around line 242):
```tsx
Target: IIT Bombay CSE
```
  2.4.You can change it and in this to your target.

If you encounter errors please dm me @ https://www.instagram.com/yarky44/
  
  2.5.After this find this code:
  ```tsx
<span className="hidden md:inline">"Till the full stop doesn't come, the sentence is not complete."</span>
```
  2.4.Change the quote to your favorite quote.
  
  2.5.Save the file.
