
import LightPillar from '@/components/LightPillar'
import Providers from "@/lib/provider";


export default function RootLayout({ children }: { children: React.ReactNode }) {

    return (
        <>
            {/* Background */}
            <div className="fixed inset-0 -z-10">
                <Providers>

                    <LightPillar
                        topColor="#1b008a"
                        bottomColor="#F97316"
                        intensity={1}
                        rotationSpeed={1}
                        glowAmount={0.01}
                        pillarWidth={6.1}
                        pillarHeight={0.2}
                        noiseIntensity={2}
                        pillarRotation={29}
                        interactive={true}
                        mixBlendMode="normal"
                        quality="medium"
                    />
                </Providers>

            </div>

            {/* App content */}
            <Providers>
                <div className="relative z-10">
                    {children}
                </div>
            </Providers>

        </>
    )
}