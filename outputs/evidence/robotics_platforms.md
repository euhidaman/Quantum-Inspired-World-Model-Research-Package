# Simulator and hardware decision memo

Checked 2026-10-06. [INFERENCE] Select analytic2D for Stage0, then a pinned ROS2/Nav2 + modern Gazebo stack for the first credible navigation study. This follows the required question: can a belief core improve robot decisions under controlled multimodal uncertainty? Photorealism should enter when perception is the tested mechanism. No simulator has been installed, benchmarked or accepted as validated.

## Comparison grounded in opened official sources

| Platform | Verified capability/status | License evidence | Compute evidence and practical decision |
|---|---|---|---|
| Gazebo + Nav2 | Nav2 setup covers modern Gazebo Harmonic or newer with ROS2 Jazzy or newer; sensor, odometry and plugin setup documented | Official repos opened; package-level license audit still required for selected release | Task-specific minimum and throughput UNKNOWN. [INFERENCE] Best first ROS integration candidate; use a pinned compatible pair and smoke-test human simulator wrapper |
| Isaac Sim / Isaac Lab | Sim provides sensor/ROS workflows; Lab current development branch targets Sim6.1 and warns of regressions | Lab core BSD3; mimic Apache2; full-featured Sim workflows include proprietary components and separate asset/dependency terms | Current Sim x86_64 table: 32GB RAM, RTX4080, 16GB VRAM minimum; Lab training needs more. [INFERENCE] Conditional visual extension; verify target hardware before choosing |
| Webots | Complete robot modeling/programming/simulation environment | Apache2 repository | Official startup minimum: dual-core2GHz, 2GB RAM, OpenGL3.3 GPU with512MB graphics memory. [INFERENCE] Candidate accessible standalone fallback; these minima do not budget ML training or crowded rendering |
| MuJoCo | General-purpose contact/dynamics physics engine | Source Apache2; docs CC-BY4 | Task throughput and visual-sensor training requirements UNKNOWN. [INFERENCE] Useful if contact/dynamics fidelity is a research factor; human behavior and benchmark scenarios still need construction |
| PyBullet | Python binding to Bullet, documented robotics/RL usage | zlib unless marked otherwise per file/folder | Current research throughput UNKNOWN. [INFERENCE] Lightweight programmable prototype candidate; do not infer photorealistic sensor validity or GPU acceleration from Bullet's separate experimental OpenCL features |
| CARLA | Autonomous-driving simulator with configurable sensor suites/environment; UE5 development and UE4 tracks coexist | CARLA code MIT; its assets CC-BY; Unreal has separate terms | UE4 package page recommends2070-class GPU/8GB; UE5 development README asks16GB+ VRAM/32GB+ RAM. [INFERENCE] Use only if road-vehicle interactions become the primary target; do not mix requirements across tracks |
| Habitat-Sim | Physics-enabled scanned/CAD scenes and RGB-D sensors; README warns no official Meta maintenance beyond0.3.4 | MIT engine; dataset terms separate | Task-specific hardware UNKNOWN. [INFERENCE] Possible visual-navigation benchmark backend but maintenance risk makes it a secondary choice |
| iGibson | Bullet-based visual/interactive scenes and domain randomization; docs identify2.2.2 | MIT repository; scene/dataset terms separate | Current hardware compatibility/throughput UNKNOWN. [INFERENCE] Consider for object interaction or visual occlusion; current maintenance and package compatibility must be checked |
| CoppeliaSim | Official edition licensing inspected; detailed current capability/hardware comparison NOT VERIFIED here | Edu limited to eligible schools/universities, noncommercial; Pro/Lite commercial terms separate | Hardware UNKNOWN. [INFERENCE] Avoid procurement decision until exact edition and robot/sensor plugin requirements are checked |

Sources for table rows: [Nav2 setup](https://docs.nav2.org/jazzy/configuration_and_development/first_time_robot_setup_guide/gazebo/), [Isaac requirements](https://docs.isaacsim.omniverse.nvidia.com/latest/installation/requirements.html), [Isaac Lab license/status](https://github.com/isaac-sim/IsaacLab), [Webots](https://github.com/cyberbotics/webots), [Webots requirements](https://github.com/cyberbotics/webots/blob/master/docs/guide/system-requirements.md), [MuJoCo](https://github.com/google-deepmind/mujoco), [Bullet](https://github.com/bulletphysics/bullet3), [CARLA UE5](https://github.com/carla-simulator/carla), [CARLA package quickstart](https://carla.readthedocs.io/en/latest/start_quickstart/), [Habitat-Sim](https://github.com/facebookresearch/habitat-sim), [iGibson](https://github.com/StanfordVL/iGibson), [CoppeliaSim license](https://manual.coppeliarobotics.com/en/licensing.htm).

[ESTABLISHED] The Isaac requirement note excludes GPUs without RT cores, explicitly including A100/H100, for the documented Sim workflow. A server training GPU is therefore not automatically a supported visual simulator GPU. Containers are documented as Linux-only. Do not generalize these requirements to every kit-less Isaac Lab workflow. [Isaac requirements](https://docs.isaacsim.omniverse.nvidia.com/latest/installation/requirements.html), [Lab workflow/license distinctions](https://github.com/isaac-sim/IsaacLab).

## Social environments and integration limits

[INFERENCE] Prefer a two-source external evaluation: replayed real trajectories for reproducible non-reactive motion, and independently designed reactive policies for ego-dependent behavior. SocNavBench supplies the first. HuNavSim supplies a ROS2 behavior layer whose manuscript includes a Gazebo wrapper; the repository currently says tested on Humble and v2 under development. This does not verify compatibility with a Jazzy/Harmonic choice. Resolve that in a pinned integration pilot, or supply a small documented modern-Gazebo wrapper. [SocNavBench Section5.3](https://arxiv.org/html/2103.00047v2), [HuNavSim repository](https://github.com/robotics-upo/hunav_sim).

[ESTABLISHED] Arena5 is present in official RSS2025 proceedings and describes Isaac Gym integration, ROS2, generated/custom worlds and social metrics. The name Isaac Gym in that paper must not be silently substituted with current Isaac Sim/Lab compatibility. Paper PDF retrieval failed, and exact current code release/license compatibility remains UNKNOWN. [Arena5 proceedings](https://www.roboticsproceedings.org/rss21/p092.html).

[ESTABLISHED] SocNavGym provides a configurable RL environment and author code under GPL3. [INFERENCE] It is a candidate pilot source, but its state observations need a controlled partial-observation wrapper if testing belief filtering. Simulated social reward does not measure actual human comfort. [SocNavGym code](https://github.com/gnns4hri/SocNavGym), [paper](https://arxiv.org/html/2304.14102v2).

## Robot and sensor options

| Option | Verified evidence | Proposed role and unresolved choice |
|---|---|---|
| TurtleBot4 / Lite | Official feature table lists RPLIDAR A1M8 for both and OAK-D-Pro versus OAK-D-Lite by variant | [INFERENCE] Indoor lidar-first study, with RGB-D later. Use external workstation inference if required; onboard structured-model latency UNKNOWN |
| Existing low-speed differential-drive ROS2 base | No specific available robot was identified | [INFERENCE] Prefer available calibrated lab hardware to buying a new platform before Stage0. Verify braking, footprint, clocks and command watchdogs |
| Clearpath Jackal | Official manual documents physical Motion Stop and controller deadman behavior | [INFERENCE] Candidate controlled outdoor study. Exact configuration, sensing payload, price and current availability UNKNOWN |
| Larger outdoor base / road vehicle | Not investigated sufficiently | [UNKNOWN] Defer; neither required for first representation result nor justified by current resource information |

Official hardware sources: [TurtleBot4 features](https://turtlebot.github.io/turtlebot4-user-manual/overview/features.html), [Jackal manual](https://docs.clearpathrobotics.com/docs_robots/outdoor_robots/jackal/user_manual_jackal/). No prices, stock, payload procurement recommendation or sensor accuracy claim is made.

[HYPOTHESIS] Begin with lidar plus wheel odometry/IMU for localization, a static map and a common detection/association frontend. Record raw synchronized observations, track covariance/existence, transformations, executed controls and independent ground truth. Add RGB-D only when visual occlusion/object binding is an explicit hypothesis. Use motion capture indoors or a calibrated external tracking rig for collision geometry where feasible. Outdoors, select independently validated ground truth for the actual site; RTK availability or precision is not assumed.

[HYPOTHESIS] Hardware preparation requires measured stopping distance at the chosen payload/surface, independent physical stopping access, software watchdog, tested restart semantics, and a supervised exclusion zone before human trials. Record all safety interventions. These controls answer the user's explicit real-robot safety requirement; they are not evidence that the learned planner is certified safe.

## Compute planning without fabricated throughput

[HYPOTHESIS] TierA runs exact small beliefs and synthetic2D evaluation on CPU or one available GPU. TierB adds the ROS sensor stack and multi-obstacle pilot on one research workstation. TierC adds rendering-intensive perception, multiple environments and replication. A non-RTX research GPU may satisfy training needs while failing the selected Isaac visual workflow.

[UNKNOWN] Training hours and disk use depend on representation, encoder, sample budget, scene count and sensor frequency. Estimate only after a saved pilot:

- Rollout hours = episodes × mean simulated episode seconds / measured effective real-time factor /3600; include reset and logging overhead in the measured factor.
- Raw storage bytes = frames × bytes per frame + lidar records + state/control logs; separately budget checkpoints and videos.
- Training hours = optimizer steps × measured seconds per step /3600, multiplied by seeds and configurations.
- Planner budget = deadline minus measured perception, transport and actuator latency; report p50/p95/p99 and deadline misses.
- Real trial budget = randomized trials × (episode duration + reset/safety overhead); block by day and operator.

The pilot should measure one small and one crowded scene, both headless and with required sensors, on the actual pinned workstation. Record exact CPU/GPU/VRAM/RAM/driver, simulator version, scene assets, physics time step, render settings, random seeds and code commits. A paper's historical frequency or vendor startup minimum is not this project's throughput.

