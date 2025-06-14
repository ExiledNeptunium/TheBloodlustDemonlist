import { fetchList } from '../content.js';
import Spinner from '../components/Spinner.js';

export default {
    components: { Spinner },
    template: `
        <main v-if="loading" class="spinner">
            <Spinner />
        </main>
        <main v-else class="page-packs-container">
            <div class="page-packs">
                <div class="packs-scroll">
                    <div v-for="pack in packs" :key="pack.name" class="pack-section">
                        <h2 class="type-title-lg">{{ pack.name }}</h2>
                        <ul class="pack-levels">
                            <li v-for="level in pack.levelsData" :key="level.id" class="pack-level">
                                <h3 class="type-label-lg clickable-title" @click="goToLevel(level.name)">
                                    {{ level.name }}
                                    <span v-if="level.listIndex"> (#{{ level.listIndex }})</span>
                                </h3>
                                <p class="type-label-md"><strong>Author:</strong> {{ level.author }}</p>
                                <p class="type-label-md"><strong>Rarity:</strong> {{ level.rarity }}</p>
                                <p class="type-label-md"><strong>Time:</strong> {{ level.time }}</p>
                                <a class="type-label-md" :href="level.verification" target="_blank">Watch Verification</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    `,
    data() {
        return {
            loading: true,
            packs: [],
        };
    },
    methods: {
        goToLevel(name) {
            const encoded = encodeURIComponent(name);
            this.$router.push(`/list/${encoded}`);
        },
    },
    async mounted() {
        const [list, packsRaw] = await Promise.all([
            fetchList(),
            fetch('/data/_packs.json').then(res => res.json())
        ]);

        const levels = list
            .map(([level], index) => ({
                ...level,
                listIndex: index + 1
            }))
            .filter(Boolean);

        this.packs = packsRaw.map(pack => ({
            ...pack,
            levelsData: pack.levels
                .map(name => levels.find(lvl => lvl.name === name))
                .filter(Boolean),
        }));

        this.loading = false;
    },
};
